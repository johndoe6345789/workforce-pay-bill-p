#pragma once
/**
 * @file hypothesis_row.h
 * @brief Internal helper: hydrate hypothesis JSON.
 *        Included by hypothesis_read.cpp +
 *        hypothesis_write.cpp only.
 */

#include "fin_types.h"
#include <drogon/orm/Row.h>

namespace services::financials
{

/**
 * @brief Hydrate a financial_hypotheses JSON from row.
 * @param r  Database row from financial_hypotheses.
 * @return   JSON object with camelCase keys.
 */
inline json hypothesisRowToJson(
    const drogon::orm::Row& r)
{
    json out;
    out["id"] =
        r["id"].as<std::string>();
    out["userId"] =
        r["user_id"].as<std::string>();
    out["assumption"] =
        r["assumption"].as<std::string>();
    out["testMethod"] =
        r["test_method"].as<std::string>();
    out["result"] =
        r["result"].as<std::string>();
    out["status"] =
        r["status"].as<std::string>();
    out["createdAt"] =
        r["created_at"].as<std::string>();
    out["updatedAt"] =
        r["updated_at"].as<std::string>();
    return out;
}

} // namespace services::financials
