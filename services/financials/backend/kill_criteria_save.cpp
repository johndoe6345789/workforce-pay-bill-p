/**
 * @file kill_criteria_save.cpp
 * @brief KillCriteriaService::saveKillCriteria
 *        implementation.
 */

#include "KillCriteriaService.h"
#include "kill_criteria_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void KillCriteriaService::saveKillCriteria(
    const std::string& userId,
    const json& body,
    Callback ok,
    ErrCallback err)
{
    auto runway = body.value(
        "runwayMonthsMin", 3);
    auto ratio  = body.value(
        "cacLtvRatioMin", 0.33);
    auto wau    = body.value(
        "weeklyActiveUsersMin", 0);
    auto custom = body.contains("customCriteria")
        ? body["customCriteria"].dump() : "[]";
    const auto sql =
        "INSERT INTO kill_criteria"
        " (user_id, runway_months_min,"
        "  cac_ltv_ratio_min,"
        "  weekly_active_users_min,"
        "  custom_criteria, updated_at)"
        " VALUES ($1::uuid,$2,$3,$4,$5::jsonb,NOW())"
        " ON CONFLICT (user_id) DO UPDATE SET"
        "  runway_months_min="
        "    EXCLUDED.runway_months_min,"
        "  cac_ltv_ratio_min="
        "    EXCLUDED.cac_ltv_ratio_min,"
        "  weekly_active_users_min="
        "    EXCLUDED.weekly_active_users_min,"
        "  custom_criteria="
        "    EXCLUDED.custom_criteria,"
        "  updated_at=NOW()"
        " RETURNING user_id::text,"
        "  runway_months_min, cac_ltv_ratio_min,"
        "  weekly_active_users_min,"
        "  custom_criteria::text,"
        "  updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "upsert failed");
                return;
            }
            ok(killCriteriaRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("saveKillCriteria: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, runway, ratio, wau, custom);
}

} // namespace services::financials
