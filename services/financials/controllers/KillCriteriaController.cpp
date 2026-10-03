/**
 * @file KillCriteriaController.cpp
 * @brief GET + PUT /api/financials/kill-criteria
 */

#include "FinancialsController.h"
#include "drogon-host/backend/utils/JsonResponse.h"

#include <nlohmann/json.hpp>
#include <spdlog/spdlog.h>

using json = nlohmann::json;
using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

void FinancialsController::getKillCriteria(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "getKillCriteria userId={}", userId);

    killCriteria_.getKillCriteria(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "getKillCriteria error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void FinancialsController::saveKillCriteria(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "saveKillCriteria userId={}", userId);

    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "invalid JSON body"));
        return;
    }

    killCriteria_.saveKillCriteria(
        userId, body,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "saveKillCriteria error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
