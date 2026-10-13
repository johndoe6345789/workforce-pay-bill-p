/**
 * @file pricing_save.cpp
 * @brief PricingService::savePricing implementation.
 */

#include "PricingService.h"
#include "pricing_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void PricingService::savePricing(
    const std::string& userId,
    const json& body,
    Callback ok,
    ErrCallback err)
{
    auto model = body.value(
        "revenueModel",
        std::string{"subscription"});
    auto price = body.value("priceGbp",       0.0);
    auto mrr   = body.value("targetMrrGbp",   0.0);
    auto cust  = body.value("initialCustomers", 0);
    auto growth = body.value(
        "monthlyGrowthPct", 0.0);
    auto notes = body.value(
        "notes", std::string{});
    const auto sql =
        "INSERT INTO pricing_inputs"
        " (user_id, revenue_model, price_gbp,"
        "  target_mrr_gbp, initial_customers,"
        "  monthly_growth_pct, notes, updated_at)"
        " VALUES ($1::uuid,$2,$3,$4,$5,$6,$7,NOW())"
        " ON CONFLICT (user_id) DO UPDATE SET"
        "  revenue_model=EXCLUDED.revenue_model,"
        "  price_gbp=EXCLUDED.price_gbp,"
        "  target_mrr_gbp=EXCLUDED.target_mrr_gbp,"
        "  initial_customers="
        "    EXCLUDED.initial_customers,"
        "  monthly_growth_pct="
        "    EXCLUDED.monthly_growth_pct,"
        "  notes=EXCLUDED.notes,"
        "  updated_at=NOW()"
        " RETURNING user_id::text, revenue_model,"
        "  price_gbp, target_mrr_gbp,"
        "  initial_customers, monthly_growth_pct,"
        "  notes, updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "upsert failed");
                return;
            }
            ok(pricingRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("savePricing: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, model, price, mrr,
        cust, growth, notes);
}

} // namespace services::financials
