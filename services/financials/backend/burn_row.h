#pragma once
/**
 * @file burn_row.h
 * @brief Internal helper: hydrate burn inputs JSON.
 *        Included by burn_get.cpp + burn_save.cpp only.
 */

#include "fin_types.h"
#include <drogon/orm/Row.h>

namespace services::financials
{

/**
 * @brief Hydrate a burn_inputs JSON from a DB row.
 * @param r  Database row from burn_inputs.
 * @return   JSON object with camelCase keys.
 */
inline json burnRowToJson(const drogon::orm::Row& r)
{
    json out;
    out["userId"] =
        r["user_id"].as<std::string>();
    out["monthlyBurnGbp"] =
        r["monthly_burn_gbp"].as<double>();
    out["cashInBankGbp"] =
        r["cash_in_bank_gbp"].as<double>();
    out["monthlyRevenueGbp"] =
        r["monthly_revenue_gbp"].as<double>();
    out["notes"] =
        r["notes"].as<std::string>();
    out["updatedAt"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::financials
