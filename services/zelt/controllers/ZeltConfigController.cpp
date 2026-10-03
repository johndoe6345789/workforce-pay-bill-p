/**
 * @file ZeltConfigController.cpp
 * @brief POST connect and DELETE disconnect handlers.
 */

#include "ZeltController.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using Cb   = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void ZeltController::connect(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid  = req->attributes()
        ->get<std::string>("user_id");
    auto body = json::parse(req->getBody(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "invalid JSON"));
        return;
    }
    const auto apiKey  = body.value("api_key", "");
    const auto baseUrl = body.value(
        "base_url", "https://api.zelt.app");
    if (apiKey.empty()) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "api_key required"));
        return;
    }
    svc_.saveConfig(uid, apiKey, baseUrl,
        [cb](const auto& d) {
            cb(::utils::jsonCreated(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

void ZeltController::disconnect(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    auto uid = req->attributes()
        ->get<std::string>("user_id");
    svc_.disconnect(uid,
        [cb](const auto& d) { cb(::utils::jsonOk(d)); },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

} // namespace controllers
