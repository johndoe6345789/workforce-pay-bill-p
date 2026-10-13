/**
 * @file burn_save.cpp
 * @brief BurnService::saveBurn implementation.
 */

#include "BurnService.h"
#include "burn_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void BurnService::saveBurn(
    const std::string& userId,
    const json& body,
    Callback ok,
    ErrCallback err)
{
    auto burn = body.value(
        "monthlyBurnGbp", 0.0);
    auto cash = body.value(
        "cashInBankGbp", 0.0);
    auto rev  = body.value(
        "monthlyRevenueGbp", 0.0);
    auto notes = body.value(
        "notes", std::string{});
    const auto sql =
        "INSERT INTO burn_inputs"
        " (user_id, monthly_burn_gbp,"
        "  cash_in_bank_gbp,"
        "  monthly_revenue_gbp, notes,"
        "  updated_at)"
        " VALUES ($1::uuid,$2,$3,$4,$5,NOW())"
        " ON CONFLICT (user_id) DO UPDATE SET"
        "  monthly_burn_gbp="
        "    EXCLUDED.monthly_burn_gbp,"
        "  cash_in_bank_gbp="
        "    EXCLUDED.cash_in_bank_gbp,"
        "  monthly_revenue_gbp="
        "    EXCLUDED.monthly_revenue_gbp,"
        "  notes=EXCLUDED.notes,"
        "  updated_at=NOW()"
        " RETURNING user_id::text,"
        "  monthly_burn_gbp, cash_in_bank_gbp,"
        "  monthly_revenue_gbp, notes,"
        "  updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "upsert failed");
                return;
            }
            ok(burnRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("saveBurn: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, burn, cash, rev, notes);
}

} // namespace services::financials
