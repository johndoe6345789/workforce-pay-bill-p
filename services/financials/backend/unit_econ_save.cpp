/**
 * @file unit_econ_save.cpp
 * @brief UnitEconService::saveUnitEcon implementation.
 */

#include "UnitEconService.h"
#include "unit_econ_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void UnitEconService::saveUnitEcon(
    const std::string& userId,
    const json& body,
    Callback ok,
    ErrCallback err)
{
    auto cac   = body.value("cacGbp",   0.0);
    auto arpu  = body.value("arpuGbp",  0.0);
    auto churn = body.value("churnPct", 0.0);
    auto cogs  = body.value("cogsPct",  0.0);
    auto notes = body.value(
        "notes", std::string{});
    const auto sql =
        "INSERT INTO unit_econ_inputs"
        " (user_id, cac_gbp, arpu_gbp,"
        "  churn_pct, cogs_pct, notes,"
        "  updated_at)"
        " VALUES ($1::uuid,$2,$3,$4,$5,$6,NOW())"
        " ON CONFLICT (user_id) DO UPDATE SET"
        "  cac_gbp=EXCLUDED.cac_gbp,"
        "  arpu_gbp=EXCLUDED.arpu_gbp,"
        "  churn_pct=EXCLUDED.churn_pct,"
        "  cogs_pct=EXCLUDED.cogs_pct,"
        "  notes=EXCLUDED.notes,"
        "  updated_at=NOW()"
        " RETURNING user_id::text, cac_gbp,"
        "  arpu_gbp, churn_pct, cogs_pct, notes,"
        "  updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "upsert failed");
                return;
            }
            ok(unitEconRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("saveUnitEcon: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, cac, arpu, churn, cogs, notes);
}

} // namespace services::financials
