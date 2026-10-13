/**
 * @file xero_client_oauth.cpp
 * @brief Token exchange and refresh for Xero OAuth2.
 */

#include "XeroClient.h"
#include <drogon/drogon.h>
#include <spdlog/spdlog.h>
#include <cstdlib>

namespace services::xero
{

static void tokenPost(
    const std::string& body,
    Callback ok,
    ErrCallback err)
{
    const auto* clientId  = std::getenv("XERO_CLIENT_ID");
    const auto* clientSec = std::getenv("XERO_CLIENT_SECRET");
    if (!clientId || !clientSec) {
        err(drogon::k503ServiceUnavailable,
            "XERO_CLIENT_ID/SECRET not set");
        return;
    }
    auto client = drogon::HttpClient::newHttpClient(
        "https://identity.xero.com");
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Post);
    req->setPath("/connect/token");
    req->addHeader("Content-Type",
                   "application/x-www-form-urlencoded");
    // Basic auth: base64(clientId:clientSecret)
    const std::string creds =
        std::string(clientId) + ":" + clientSec;
    req->addHeader("Authorization",
                   "Basic " + drogon::utils::base64Encode(
                       reinterpret_cast<const unsigned char*>(
                           creds.data()), creds.size()));
    req->setBody(body);
    client->sendRequest(req,
        [ok, err](drogon::ReqResult res,
                  const drogon::HttpResponsePtr& resp) {
            if (res != drogon::ReqResult::Ok || !resp) {
                err(drogon::k502BadGateway, "Xero token error");
                return;
            }
            auto j = json::parse(resp->body(), nullptr, false);
            if (j.is_discarded())
                err(drogon::k502BadGateway, "invalid token JSON");
            else
                ok(std::move(j));
        });
}

void xeroExchangeCode(
    const std::string& code,
    const std::string& redirectUri,
    Callback ok,
    ErrCallback err)
{
    tokenPost("grant_type=authorization_code"
              "&code=" + code +
              "&redirect_uri=" + redirectUri, ok, err);
}

void xeroRefreshToken(
    const std::string& refreshToken,
    Callback ok,
    ErrCallback err)
{
    tokenPost("grant_type=refresh_token"
              "&refresh_token=" + refreshToken, ok, err);
}

} // namespace services::xero
