/**
 * @file zelt_client.cpp
 * @brief GET requests to the Zelt API with API-key auth.
 */

#include "ZeltClient.h"
#include <drogon/drogon.h>
#include <spdlog/spdlog.h>

namespace services::zelt
{

void zeltGet(
    const std::string& path,
    const std::string& apiKey,
    const std::string& baseUrl,
    Callback ok,
    ErrCallback err)
{
    auto client = drogon::HttpClient::newHttpClient(baseUrl);
    auto req    = drogon::HttpRequest::newHttpRequest();
    req->setMethod(drogon::Get);
    req->setPath(path);
    req->addHeader("X-API-Key", apiKey);
    req->addHeader("Accept",    "application/json");

    client->sendRequest(req,
        [ok, err, path](
            drogon::ReqResult res,
            const drogon::HttpResponsePtr& resp)
        {
            if (res != drogon::ReqResult::Ok || !resp) {
                spdlog::warn("zeltGet {} network error", path);
                err(drogon::k502BadGateway, "Zelt unreachable");
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

} // namespace services::zelt
