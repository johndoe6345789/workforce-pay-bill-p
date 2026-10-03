/**
 * @file xero_client_get.cpp
 * @brief GET requests to api.xero.com with Bearer auth.
 */

#include "XeroClient.h"
#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

namespace services::xero
{

void xeroGet(
    const std::string& path,
    const std::string& token,
    const std::string& tenantId,
    Callback ok,
    ErrCallback err)
{
    auto client = drogon::HttpClient::newHttpClient(
        "https://api.xero.com");
    auto req = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Get);
    req->setPath(path);
    req->addHeader("Authorization", "Bearer " + token);
    req->addHeader("Xero-Tenant-Id", tenantId);
    req->addHeader("Accept", "application/json");

    client->sendRequest(req,
        [ok, err, path](
            drogon::ReqResult res,
            const drogon::HttpResponsePtr& resp)
        {
            if (res != drogon::ReqResult::Ok || !resp) {
                spdlog::warn("xeroGet {} network error", path);
                err(drogon::k502BadGateway, "Xero unreachable");
                return;
            }
            auto body = json::parse(
                resp->body(), nullptr, false);
            if (body.is_discarded()) {
                err(drogon::k502BadGateway, "invalid JSON");
                return;
            }
            ok(std::move(body));
        });
}

} // namespace services::xero
