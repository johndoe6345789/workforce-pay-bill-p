/**
 * @file zelt_store_proxy.cpp
 * @brief ZeltStore proxy methods — forward API calls
 *        to Zelt after loading user's API key.
 */

#include "ZeltStore.h"
#include "ZeltClient.h"

namespace services::zelt
{

void ZeltStore::listPayroll(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withConfig(userId,
        [ok, err](std::string key, std::string base) {
            zeltGet("/v1/payroll/runs", key, base, ok, err);
        }, err);
}

void ZeltStore::listEmployees(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withConfig(userId,
        [ok, err](std::string key, std::string base) {
            zeltGet("/v1/employees", key, base, ok, err);
        }, err);
}

void ZeltStore::listLeave(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withConfig(userId,
        [ok, err](std::string key, std::string base) {
            zeltGet("/v1/leave/requests", key, base, ok, err);
        }, err);
}

void ZeltStore::listExpenses(
    const std::string& userId,
    Callback ok, ErrCallback err)
{
    withConfig(userId,
        [ok, err](std::string key, std::string base) {
            zeltGet("/v1/expenses", key, base, ok, err);
        }, err);
}

} // namespace services::zelt
