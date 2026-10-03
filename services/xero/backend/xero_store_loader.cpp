/**
 * @file xero_store_loader.cpp
 * @brief XeroStore::saveTokens and ::withToken.
 */

#include "XeroStore.h"
#include <spdlog/spdlog.h>

namespace services::xero
{

void XeroStore::saveTokens(
    const std::string& userId,
    const XeroToken& t,
    Callback ok, ErrCallback err)
{
    db()->execSqlAsync(
        "INSERT INTO xero_connections "
        "  (user_id,tenant_id,tenant_name,"
        "   access_token,refresh_token,expires_at) "
        "VALUES($1,$2,$3,$4,$5,"
        "  now()+interval'30 minutes') "
        "ON CONFLICT(user_id) DO UPDATE SET "
        "  tenant_id=$2,tenant_name=$3,"
        "  access_token=$4,refresh_token=$5,"
        "  expires_at=now()+interval'30 minutes',"
        "  updated_at=now()",
        [ok](const drogon::orm::Result&) {
            ok({{"ok", true}});
        },
        [err](const drogon::orm::DrogonDbException& e) {
            spdlog::warn("xero saveTokens: {}",
                         e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, t.tenantId, t.tenantName,
        t.accessToken, t.refreshToken);
}

void XeroStore::withToken(
    const std::string& userId,
    std::function<void(XeroToken)> then,
    ErrCallback err)
{
    db()->execSqlAsync(
        "SELECT tenant_id,tenant_name,access_token,"
        "refresh_token FROM xero_connections "
        "WHERE user_id=$1",
        [then, err](const drogon::orm::Result& r) {
            if (r.empty()) {
                err(drogon::k401Unauthorized,
                    "Xero not connected");
                return;
            }
            XeroToken t;
            t.tenantId     =
                r[0]["tenant_id"].as<std::string>();
            t.tenantName   =
                r[0]["tenant_name"].as<std::string>();
            t.accessToken  =
                r[0]["access_token"].as<std::string>();
            t.refreshToken =
                r[0]["refresh_token"].as<std::string>();
            then(std::move(t));
        },
        [err](const drogon::orm::DrogonDbException& e) {
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::xero
