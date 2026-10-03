/**
 * @file kill_criteria_get.cpp
 * @brief KillCriteriaService::getKillCriteria
 *        implementation.
 */

#include "KillCriteriaService.h"
#include "kill_criteria_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void KillCriteriaService::getKillCriteria(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT user_id::text,"
        " runway_months_min, cac_ltv_ratio_min,"
        " weekly_active_users_min,"
        " custom_criteria::text, updated_at::text"
        " FROM kill_criteria"
        " WHERE user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            if (res.empty()) {
                // Return sensible defaults
                json def;
                def["runwayMonthsMin"]     = 3;
                def["cacLtvRatioMin"]      = 0.33;
                def["weeklyActiveUsersMin"] = 0;
                def["customCriteria"]      =
                    json::array();
                ok(std::move(def));
                return;
            }
            ok(killCriteriaRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("getKillCriteria: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::financials
