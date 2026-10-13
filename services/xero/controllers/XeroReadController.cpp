/**
 * @file XeroReadController.cpp
 * @brief GET handlers for Xero data endpoints.
 */

#include "XeroController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void XeroController::getStatus(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.getStatus(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void XeroController::listInvoices(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.listInvoices(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void XeroController::listTransactions(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.listTransactions(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void XeroController::getProfitLoss(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.getProfitLoss(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void XeroController::getBalanceSheet(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.getBalanceSheet(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void XeroController::getCashFlow(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.getCashFlow(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}
} // namespace controllers
