#pragma once
/**
 * @file pricing_row.h
 * @brief Internal helper: hydrate pricing inputs JSON.
 *        Included by pricing_get.cpp +
 *        pricing_save.cpp only.
 */

#include "fin_types.h"
#include <drogon/orm/Row.h>

namespace services::financials
{

/**
 * @brief Hydrate a pricing_inputs JSON from a DB row.
 * @param r  Database row from pricing_inputs.
 * @return   JSON object with camelCase keys.
 */
inline json pricingRowToJson(
    const drogon::orm::Row& r)
{
    json out;
    out["userId"] =
        r["user_id"].as<std::string>();
    out["revenueModel"] =
        r["revenue_model"].as<std::string>();
    out["priceGbp"] =
        r["price_gbp"].as<double>();
    out["targetMrrGbp"] =
        r["target_mrr_gbp"].as<double>();
    out["initialCustomers"] =
        r["initial_customers"].as<int>();
    out["monthlyGrowthPct"] =
        r["monthly_growth_pct"].as<double>();
    out["notes"] =
        r["notes"].as<std::string>();
    out["updatedAt"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::financials
