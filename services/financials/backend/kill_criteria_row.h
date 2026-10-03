#pragma once
/**
 * @file kill_criteria_row.h
 * @brief Internal helper: hydrate kill criteria JSON.
 *        Included by kill_criteria_get.cpp +
 *        kill_criteria_save.cpp only.
 */

#include "fin_types.h"
#include <drogon/orm/Row.h>

namespace services::financials
{

/**
 * @brief Hydrate a kill_criteria JSON from a DB row.
 * @param r  Database row from kill_criteria.
 * @return   JSON object with camelCase keys.
 */
inline json killCriteriaRowToJson(
    const drogon::orm::Row& r)
{
    json out;
    out["userId"] =
        r["user_id"].as<std::string>();
    out["runwayMonthsMin"] =
        r["runway_months_min"].as<int>();
    out["cacLtvRatioMin"] =
        r["cac_ltv_ratio_min"].as<double>();
    out["weeklyActiveUsersMin"] =
        r["weekly_active_users_min"].as<int>();
    out["customCriteria"] = json::parse(
        r["custom_criteria"].as<std::string>(),
        nullptr, false);
    if (out["customCriteria"].is_discarded())
        out["customCriteria"] = json::array();
    out["updatedAt"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::financials
