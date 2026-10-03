/**
 * @file xero_store_status.cpp
 * @brief XeroStore::getStatus and ::disconnect.
 */

#include "XeroStore.h"
#include <spdlog/spdlog.h>

namespace services::xero
{

void XeroStore::getStatus(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    db()->execSqlAsync(
        "SELECT tenant_name FROM xero_connections "
        "WHERE user_id=$1",
        [ok](const drogon::orm::Result& r) {
            json j = r.empty()
                ? json{{"connected", false}}
                : json{{"connected",  true},
                       {"tenantName",
                        r[0]["tenant_name"]
                          .as<std::string>()}};
            ok(j);
        },
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::warn("xero getStatus: {}",
                         e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

void XeroStore::disconnect(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    db()->execSqlAsync(
        "DELETE FROM xero_connections WHERE user_id=$1",
        [ok](const drogon::orm::Result&) {
            ok({{"ok", true}});
        },
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::warn("xero disconnect: {}",
                         e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::xero
