/**
 * @file ZeltReadController.cpp
 * @brief GET handlers for Zelt data endpoints.
 */

#include "ZeltController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void ZeltController::getStatus(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.getStatus(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void ZeltController::listPayroll(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.listPayroll(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void ZeltController::listEmployees(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.listEmployees(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void ZeltController::listLeave(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.listLeave(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void ZeltController::listExpenses(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.listExpenses(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

} // namespace controllers
