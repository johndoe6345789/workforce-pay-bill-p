/**
 * @file xero_store_proxy.cpp
 * @brief XeroStore proxy methods — forward API calls
 *        to Xero after loading user's access token.
 */

#include "XeroStore.h"
#include "XeroClient.h"

namespace services::xero
{

static const std::string BASE = "/api.xro/2.0/";

void XeroStore::listInvoices(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withToken(userId,
        [ok, err](XeroToken t) {
            xeroGet(BASE + "Invoices?statuses=AUTHORISED,PAID",
                    t.accessToken, t.tenantId, ok, err);
        }, err);
}

void XeroStore::listTransactions(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withToken(userId,
        [ok, err](XeroToken t) {
            xeroGet(BASE + "BankTransactions",
                    t.accessToken, t.tenantId, ok, err);
        }, err);
}

void XeroStore::getProfitLoss(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withToken(userId,
        [ok, err](XeroToken t) {
            xeroGet(BASE + "Reports/ProfitAndLoss",
                    t.accessToken, t.tenantId, ok, err);
        }, err);
}

void XeroStore::getBalanceSheet(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withToken(userId,
        [ok, err](XeroToken t) {
            xeroGet(BASE + "Reports/BalanceSheet",
                    t.accessToken, t.tenantId, ok, err);
        }, err);
}

void XeroStore::getCashFlow(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withToken(userId,
        [ok, err](XeroToken t) {
            xeroGet(BASE + "Reports/CashSummary",
                    t.accessToken, t.tenantId, ok, err);
        }, err);
}

} // namespace services::xero
