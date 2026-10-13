#pragma once
/**
 * @file ZeltClient.h
 * @brief HTTP client for the Zelt HR/Payroll API.
 */

#include "zelt_types.h"
#include <string>

namespace services::zelt
{

/**
 * @brief GET request to the Zelt API.
 * @param path    API path, e.g. "/v1/employees".
 * @param apiKey  User's Zelt API key.
 * @param baseUrl Zelt base URL from zelt_connections.
 * @param ok      Called with parsed JSON body on success.
 * @param err     Called with status + message on failure.
 */
void zeltGet(
    const std::string& path,
    const std::string& apiKey,
    const std::string& baseUrl,
    Callback ok,
    ErrCallback err);

} // namespace services::zelt
