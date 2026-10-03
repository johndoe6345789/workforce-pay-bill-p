#pragma once
/**
 * @file PricingService.h
 * @brief Service for pricing / revenue model inputs
 *        stored in the pricing_inputs table.
 */

#include "fin_types.h"
#include <string>

namespace services::financials
{

/**
 * @brief CRUD service for pricing_inputs.
 *        One row per user (upsert semantics).
 */
class PricingService
{
  public:
    /**
     * @brief Fetch the pricing record for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with pricing JSON on success.
     * @param err     Called with status + msg on error.
     */
    void getPricing(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Upsert the pricing record for a user.
     * @param userId    UUID of the authenticated user.
     * @param body      Request body with pricing fields.
     * @param ok        Called with saved row on success.
     * @param err       Called with status + msg on error.
     */
    void savePricing(
        const std::string& userId,
        const json& body,
        Callback ok,
        ErrCallback err);

  private:
    /** @brief Convenience accessor for the DB client. */
    static auto db()
    {
        return drogon::app().getDbClient();
    }
};

} // namespace services::financials
