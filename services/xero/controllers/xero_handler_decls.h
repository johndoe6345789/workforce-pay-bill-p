#pragma once
/**
 * @file xero_handler_decls.h
 * @brief Expands inside XeroController class body.
 */

#define XERO_HANDLER_DECLS \
    void getStatus( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void oauthConnect( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void oauthCallback( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void disconnect( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void listInvoices( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void listTransactions( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void getProfitLoss( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void getBalanceSheet( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void getCashFlow( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb);
