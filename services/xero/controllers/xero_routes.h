#pragma once
/**
 * @file xero_routes.h
 * @brief Route table for the Xero controller.
 */

#define XERO_ROUTES(C) \
    ADD_METHOD_TO(C::getStatus, \
        "/api/xero/status", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::oauthConnect, \
        "/api/xero/connect", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::oauthCallback, \
        "/api/xero/callback", \
        drogon::Get); \
    ADD_METHOD_TO(C::disconnect, \
        "/api/xero/disconnect", \
        drogon::Delete, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listInvoices, \
        "/api/xero/invoices", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listTransactions, \
        "/api/xero/transactions", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::getProfitLoss, \
        "/api/xero/reports/profit-loss", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::getBalanceSheet, \
        "/api/xero/reports/balance-sheet", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::getCashFlow, \
        "/api/xero/reports/cash-flow", \
        drogon::Get, "filters::JwtAuthFilter");
