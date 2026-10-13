/**
 * @file zelt_store_connection.cpp
 * @brief ZeltStore: getStatus, disconnect, withConfig.
 */

#include "ZeltStore.h"
#include <spdlog/spdlog.h>

namespace services::zelt
{

void ZeltStore::getStatus(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    db()->execSqlAsync(
        "SELECT 1 FROM zelt_connections WHERE user_id=$1",
        [ok](const drogon::orm::Result& r) {
            ok({{"connected", !r.empty()}});
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

void ZeltStore::disconnect(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    db()->execSqlAsync(
        "DELETE FROM zelt_connections WHERE user_id=$1",
        [ok](const drogon::orm::Result&) {
            ok({{"ok", true}});
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

void ZeltStore::withConfig(
    const std::string& userId,
    std::function<void(std::string, std::string)> then,
    ErrCallback err)
{
    db()->execSqlAsync(
        "SELECT api_key,base_url FROM zelt_connections "
        "WHERE user_id=$1",
        [then, err](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(drogon::k401Unauthorized,
                    "Zelt not connected");
                return;
            }
            then(r[0]["api_key"].as<std::string>(),
                 r[0]["base_url"].as<std::string>());
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::zelt
