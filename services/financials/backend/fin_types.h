#pragma once
/**
 * @file fin_types.h
 * @brief Shared type aliases and callback
 *        signatures for the financials domain.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <functional>
#include <string>

namespace services::financials
{

using json = nlohmann::json;

/** @brief Success callback carrying a JSON body. */
using Callback =
    std::function<void(json)>;

/** @brief Error callback: HTTP status + message. */
using ErrCallback =
    std::function<void(
        drogon::HttpStatusCode, std::string)>;

} // namespace services::financials
