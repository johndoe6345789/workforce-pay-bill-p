#pragma once
/**
 * @file HypothesisService.h
 * @brief Service for financial hypothesis tracking
 *        stored in the financial_hypotheses table.
 */

#include "fin_types.h"
#include <string>

namespace services::financials
{

/**
 * @brief CRUD service for financial_hypotheses.
 *        Many rows per user.
 */
class HypothesisService
{
  public:
    /**
     * @brief List all hypotheses for a user.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with JSON array on success.
     * @param err     Called with status + msg on error.
     */
    void listHypotheses(
        const std::string& userId,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Create a new hypothesis for a user.
     * @param userId  UUID of the authenticated user.
     * @param body    Request body with hypothesis fields.
     * @param ok      Called with created row on success.
     * @param err     Called with status + msg on error.
     */
    void createHypothesis(
        const std::string& userId,
        const json& body,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Update a hypothesis (ownership checked).
     * @param id      UUID of the hypothesis.
     * @param userId  UUID of the authenticated user.
     * @param body    Fields to update.
     * @param ok      Called with updated row on success.
     * @param err     Called with status + msg on error.
     */
    void updateHypothesis(
        const std::string& id,
        const std::string& userId,
        const json& body,
        Callback ok,
        ErrCallback err);

    /**
     * @brief Delete a hypothesis (ownership checked).
     * @param id      UUID of the hypothesis.
     * @param userId  UUID of the authenticated user.
     * @param ok      Called with empty object on success.
     * @param err     Called with status + msg on error.
     */
    void deleteHypothesis(
        const std::string& id,
        const std::string& userId,
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
