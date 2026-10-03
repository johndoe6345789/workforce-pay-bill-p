#pragma once
/**
 * @file XeroClient.h
 * @brief HTTP proxy client for the Xero Accounting API.
 *        Attaches Bearer token; caller supplies the token.
 */

#include "xero_types.h"
#include <string>

namespace services::xero
{

/**
 * @brief Calls GET on the Xero API at api.xero.com.
 * @param path       API path, e.g. "/api.xro/2.0/Invoices".
 * @param token      Active access token for the user.
 * @param tenantId   Xero organisation (tenant) GUID.
 * @param ok         Called with parsed JSON body on success.
 * @param err        Called with status + message on failure.
 */
void xeroGet(
    const std::string& path,
    const std::string& token,
    const std::string& tenantId,
    Callback ok,
    ErrCallback err);

/**
 * @brief Exchanges an auth code for access + refresh tokens.
 * @param code        OAuth authorisation code from callback.
 * @param redirectUri Registered redirect URI.
 * @param ok          Called with raw token JSON body.
 * @param err         Called with status + message on failure.
 */
void xeroExchangeCode(
    const std::string& code,
    const std::string& redirectUri,
    Callback ok,
    ErrCallback err);

/**
 * @brief Refreshes an expired access token.
 * @param refreshToken Current refresh token.
 * @param ok           Called with new token JSON body.
 * @param err          Called with status + message on failure.
 */
void xeroRefreshToken(
    const std::string& refreshToken,
    Callback ok,
    ErrCallback err);

} // namespace services::xero
