#pragma once
/**
 * @file zelt_handler_decls.h
 * @brief Expands inside ZeltController class body.
 */

#define ZELT_HANDLER_DECLS \
    void getStatus( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void connect( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void disconnect( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void listPayroll( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void listEmployees( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void listLeave( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    void listExpenses( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb);
