/**
 * @file UnitEconController.cpp
 * @brief GET + PUT /api/financials/unit-econ
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

void FinancialsController::getUnitEcon(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug("getUnitEcon userId={}", userId);

    unitEcon_.getUnitEcon(
        userId,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "getUnitEcon error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

void FinancialsController::saveUnitEcon(
    const drogon::HttpRequestPtr& req,
    Cb&& cb)
{
    auto userId = req->attributes()
        ->get<std::string>("user_id");
    spdlog::debug("saveUnitEcon userId={}", userId);

    auto body = json::parse(
        req->getBody(), nullptr, false);
    if (body.is_discarded()) {
        cb(::utils::jsonError(
            drogon::k400BadRequest,
            "invalid JSON body"));
        return;
    }

    unitEcon_.saveUnitEcon(
        userId, body,
        [cb](const json& data) {
            cb(::utils::jsonOk(data));
        },
        [cb](drogon::HttpStatusCode code,
             const std::string& msg) {
            spdlog::warn(
                "saveUnitEcon error: {}", msg);
            cb(::utils::jsonError(code, msg));
        });
}

} // namespace controllers
