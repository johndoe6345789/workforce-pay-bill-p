/**
 * @file HypothesisWriteController.cpp
 * @brief PUT + DELETE /api/financials/hypotheses/{id}
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

void FinancialsController::updateHypothesis(
    const drogon::HttpRequestPtr& req,
    Cb&& cb,
    std::string id)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "updateHypothesis id={}", id);

    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "invalid JSON body"));
        return;
    }

    hypotheses_.updateHypothesis(
        id, userId, body,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "updateHypothesis error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void FinancialsController::deleteHypothesis(
    const drogon::HttpRequestPtr& req,
    Cb&& cb,
    std::string id)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug(
        "deleteHypothesis id={}", id);

    hypotheses_.deleteHypothesis(
        id, userId,
        [cb](const json&) {
            cb(::utils::jsonOk(json::object()));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "deleteHypothesis error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
