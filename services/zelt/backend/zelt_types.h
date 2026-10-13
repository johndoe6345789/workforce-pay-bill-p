#pragma once
/**
 * @file zelt_types.h
 * @brief Common types for the Zelt domain.
 */

#include <drogon/drogon.h>
#include <nlohmann/json.hpp>
#include <functional>
#include <string>

namespace services::zelt
{

using json        = nlohmann::json;
using Callback    = std::function<void(json)>;
using ErrCallback = std::function<void(
    drogon::HttpStatusCode, std::string)>;

} // namespace services::zelt
