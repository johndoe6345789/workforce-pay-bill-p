/**
 * @file unit_econ_get.cpp
 * @brief UnitEconService::getUnitEcon implementation.
 */

#include "UnitEconService.h"
#include "unit_econ_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void UnitEconService::getUnitEcon(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT user_id::text, cac_gbp, arpu_gbp,"
        " churn_pct, cogs_pct, notes,"
        " updated_at::text"
        " FROM unit_econ_inputs"
        " WHERE user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            if (res.empty()) {
                ok(json::object());
                return;
            }
            ok(unitEconRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("getUnitEcon: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::financials
