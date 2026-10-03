/**
 * @file zelt_store_save.cpp
 * @brief ZeltStore::saveConfig.
 */

#include "ZeltStore.h"
#include <spdlog/spdlog.h>

namespace services::zelt
{

void ZeltStore::saveConfig(
    const std::string& userId,
    const std::string& apiKey,
    const std::string& baseUrl,
    Callback ok, ErrCallback err)
{
    db()->execSqlAsync(
        "INSERT INTO zelt_connections"
        "  (user_id,api_key,base_url) "
        "VALUES($1,$2,$3) "
        "ON CONFLICT(user_id) DO UPDATE SET "
        "  api_key=$2,base_url=$3,updated_at=now()",
        [ok](const drogon::orm::Result&) {
            ok({{"ok", true}});
        },
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::warn("zelt saveConfig: {}",
                         e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, apiKey, baseUrl);
}

} // namespace services::zelt
