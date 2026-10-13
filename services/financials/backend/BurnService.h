#pragma once
/**
 * @file BurnService.h
 * @brief Service for burn rate inputs stored in the
 *        burn_inputs table.
 */

#include "fin_types.h"
#include <string>

namespace services::financials
{

/**
 * @brief CRUD service for burn_inputs.
 *        One row per user (upsert semantics).
 */
class BurnService
{
  public:
    /**
     * @brief Fetch the burn record for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with burn JSON on success.
     * @param err     Called with status + msg on error.
     */
    void getBurn(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Upsert the burn record for a user.
     * @param userId    UUID of the authenticated user.
     * @param body      Request body with burn fields.
     * @param ok        Called with saved row on success.
     * @param err       Called with status + msg on error.
     */
    void saveBurn(
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
