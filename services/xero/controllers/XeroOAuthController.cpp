/**
 * @file XeroOAuthController.cpp
 * @brief OAuth connect + callback handlers.
 */

#include "XeroController.h"
#include "xero/backend/XeroClient.h"
#include "drogon-host/backend/utils/JsonResponse.h"
#include <cstdlib>

using Cb = std::function<void(
    const drogon::HttpResponsePtr&)>;

namespace controllers
{

static std::string redirectUri()
{
    const auto* r = std::getenv("XERO_REDIRECT_URI");
    return r ? r : "http://localhost:8889/api/xero/callback";
}

void XeroController::oauthConnect(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    const auto* clientId = std::getenv("XERO_CLIENT_ID");
    if (!clientId) {
        cb(::utils::jsonError(
            drogon::k503ServiceUnavailable,
            "XERO_CLIENT_ID not set"));
        return;
    }
    const std::string url =
        "https://login.xero.com/identity/connect/authorize"
        "?response_type=code"
        "&client_id=" + std::string(clientId) +
        "&redirect_uri=" + redirectUri() +
        "&scope=openid%20profile%20email%20accounting"
        ".transactions%20accounting.reports.read"
        "%20offline_access"
        "&state=" +
        req->attributes()->get<std::string>("user_id");
    cb(drogon::HttpResponse::newRedirectionResponse(url));
}

void XeroController::oauthCallback(
    const drogon::HttpRequestPtr& req, Cb&& cb)
{
    const auto code  = req->getParameter("code");
    const auto state = req->getParameter("state");
    if (code.empty() || state.empty()) {
        cb(::utils::jsonError(drogon::k400BadRequest,
                              "missing code or state"));
        return;
    }
    services::xero::xeroExchangeCode(code, redirectUri(),
        [this, state, cb](const auto& tokens) {
            services::xero::XeroToken t;
            t.accessToken  = tokens.value("access_token","");
            t.refreshToken = tokens.value("refresh_token","");
            t.tenantId     = "";
            t.tenantName   = "Xero Organisation";
            svc_.saveTokens(state, t,
                [cb](const auto&) {
                    cb(drogon::HttpResponse
                       ::newRedirectionResponse(
                           "/app/en/accounting"));
                },
                [cb](auto c, const auto& m) {
                    cb(::utils::jsonError(c, m)); });
        },
        [cb](auto c, const auto& m) {
            cb(::utils::jsonError(c, m)); });
}

} // namespace controllers
