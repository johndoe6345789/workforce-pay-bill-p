#pragma once
/**
 * @file unit_econ_row.h
 * @brief Internal helper: hydrate unit econ JSON.
 *        Included by unit_econ_get.cpp +
 *        unit_econ_save.cpp only.
 */

#include "fin_types.h"
#include <drogon/orm/Row.h>

namespace services::financials
{

/**
 * @brief Hydrate a unit_econ_inputs JSON from a DB row.
 * @param r  Database row from unit_econ_inputs.
 * @return   JSON object with camelCase keys.
 */
inline json unitEconRowToJson(
    const drogon::orm::Row& r)
{
    json out;
    out["userId"] =
        r["user_id"].as<std::string>();
    out["cacGbp"] =
        r["cac_gbp"].as<double>();
    out["arpuGbp"] =
        r["arpu_gbp"].as<double>();
    out["churnPct"] =
        r["churn_pct"].as<double>();
    out["cogsPct"] =
        r["cogs_pct"].as<double>();
    out["notes"] =
        r["notes"].as<std::string>();
    out["updatedAt"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::financials
