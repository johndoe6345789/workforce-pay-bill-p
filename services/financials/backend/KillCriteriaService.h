#pragma once
/**
 * @file KillCriteriaService.h
 * @brief Service for kill criteria config stored
 *        in the kill_criteria table.
 */

#include "fin_types.h"
#include <string>

namespace services::financials
{

/**
 * @brief CRUD service for kill_criteria.
 *        One row per user (upsert semantics).
 */
class KillCriteriaService
{
  public:
    /**
     * @brief Fetch kill criteria for a user.
     *        Returns defaults if no row exists.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with criteria JSON.
     * @param err     Called with status + msg on error.
     */
    void getKillCriteria(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Upsert kill criteria for a user.
     * @param userId    UUID of the authenticated user.
     * @param body      Request body with criteria fields.
     * @param ok        Called with saved row on success.
     * @param err       Called with status + msg on error.
     */
    void saveKillCriteria(
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
