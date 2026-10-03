#pragma once
/**
 * @file UnitEconService.h
 * @brief Service for unit economics inputs stored
 *        in the unit_econ_inputs table.
 */

#include "fin_types.h"
#include <string>

namespace services::financials
{

/**
 * @brief CRUD service for unit_econ_inputs.
 *        One row per user (upsert semantics).
 */
class UnitEconService
{
  public:
    /**
     * @brief Fetch the unit econ record for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with unit econ JSON.
     * @param err     Called with status + msg on error.
     */
    void getUnitEcon(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Upsert the unit econ record for a user.
     * @param userId    UUID of the authenticated user.
     * @param body      Request body with unit econ fields.
     * @param ok        Called with saved row on success.
     * @param err       Called with status + msg on error.
     */
    void saveUnitEcon(
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
