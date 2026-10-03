#pragma once
/**
 * @file xero_types.h
 * @brief Common types for the Xero domain.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <functional>
#include <string>

namespace services::xero
{

using json        = nlohmann::json;
using Callback    = std::function<void(json)>;
using ErrCallback = std::function<void(
    drogon::HttpStatusCode, std::string)>;

/** @brief Xero OAuth token bundle for one user. */
struct XeroToken
{
    std::string tenantId;
    std::string tenantName;
    std::string accessToken;
    std::string refreshToken;
};

} // namespace services::xero
