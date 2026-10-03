/**
 * @file burn_get.cpp
 * @brief BurnService::getBurn implementation.
 */

#include "BurnService.h"
#include "burn_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void BurnService::getBurn(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT user_id::text,"
        " monthly_burn_gbp, cash_in_bank_gbp,"
        " monthly_revenue_gbp, notes,"
        " updated_at::text"
        " FROM burn_inputs WHERE user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            if (res.empty()) {
                ok(json::object());
                return;
            }
            ok(burnRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("getBurn: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::financials
