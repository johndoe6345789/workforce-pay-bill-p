/**
 * @file pricing_get.cpp
 * @brief PricingService::getPricing implementation.
 */

#include "PricingService.h"
#include "pricing_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void PricingService::getPricing(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT user_id::text, revenue_model,"
        " price_gbp, target_mrr_gbp,"
        " initial_customers, monthly_growth_pct,"
        " notes, updated_at::text"
        " FROM pricing_inputs"
        " WHERE user_id=$1::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            if (res.empty()) {
                ok(json::object());
                return;
            }
            ok(pricingRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("getPricing: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

} // namespace services::financials
