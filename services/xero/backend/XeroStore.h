#pragma once
/**
 * @file XeroStore.h
 * @brief DB token store + Xero API proxy methods.
 */

#include "xero_types.h"
#include <string>

namespace services::xero
{

/** @brief Manages xero_connections and proxies API calls. */
class XeroStore
{
  public:
    /** @brief Return connection status for @p userId. */
    void getStatus(const std::string& userId,
                   Callback ok, ErrCallback err);

    /** @brief Save tokens after OAuth callback. */
    void saveTokens(const std::string& userId,
                    const XeroToken& token,
                    Callback ok, ErrCallback err);

    /** @brief Remove stored tokens for @p userId. */
    void disconnect(const std::string& userId,
                    Callback ok, ErrCallback err);

    /** @brief Proxy: GET /api.xro/2.0/Invoices. */
    void listInvoices(const std::string& userId,
                      Callback ok, ErrCallback err);

    /** @brief Proxy: GET /api.xro/2.0/BankTransactions. */
    void listTransactions(const std::string& userId,
                          Callback ok, ErrCallback err);

    /** @brief Proxy: GET /api.xro/2.0/Reports/ProfitAndLoss. */
    void getProfitLoss(const std::string& userId,
                       Callback ok, ErrCallback err);

    /** @brief Proxy: GET /api.xro/2.0/Reports/BalanceSheet. */
    void getBalanceSheet(const std::string& userId,
                         Callback ok, ErrCallback err);

    /** @brief Proxy: GET /api.xro/2.0/Reports/CashSummary. */
    void getCashFlow(const std::string& userId,
                     Callback ok, ErrCallback err);

  private:
    static auto db()
        { return drogon::app().getDbClient(); }

    /** @brief Load token row; calls ok or err. */
    void withToken(const std::string& userId,
                   std::function<void(XeroToken)> then,
                   ErrCallback err);
};

} // namespace services::xero
