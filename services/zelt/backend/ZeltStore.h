#pragma once
/**
 * @file ZeltStore.h
 * @brief DB config store + Zelt API proxy methods.
 */

#include "zelt_types.h"
#include <string>
#include <functional>

namespace services::zelt
{

/** @brief Manages zelt_connections and proxies API calls. */
class ZeltStore
{
  public:
    /** @brief Return connection status for @p userId. */
    void getStatus(const std::string& userId,
                   Callback ok, ErrCallback err);

    /** @brief Save Zelt API key for @p userId. */
    void saveConfig(const std::string& userId,
                    const std::string& apiKey,
                    const std::string& baseUrl,
                    Callback ok, ErrCallback err);

    /** @brief Remove stored config for @p userId. */
    void disconnect(const std::string& userId,
                    Callback ok, ErrCallback err);

    /** @brief Proxy: GET /v1/payroll/runs. */
    void listPayroll(const std::string& userId,
                     Callback ok, ErrCallback err);

    /** @brief Proxy: GET /v1/employees. */
    void listEmployees(const std::string& userId,
                       Callback ok, ErrCallback err);

    /** @brief Proxy: GET /v1/leave/requests. */
    void listLeave(const std::string& userId,
                   Callback ok, ErrCallback err);

    /** @brief Proxy: GET /v1/expenses. */
    void listExpenses(const std::string& userId,
                      Callback ok, ErrCallback err);

  private:
    static auto db()
        { return drogon::app().getDbClient(); }

    void withConfig(
        const std::string& userId,
        std::function<void(std::string, std::string)> then,
        ErrCallback err);
};

} // namespace services::zelt
