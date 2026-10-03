#pragma once
/**
 * @file zelt_routes.h
 * @brief Route table for the Zelt controller.
 */

#define ZELT_ROUTES(C) \
    ADD_METHOD_TO(C::getStatus, \
        "/api/zelt/status", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::connect, \
        "/api/zelt/connect", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::disconnect, \
        "/api/zelt/disconnect", \
        drogon::Delete, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listPayroll, \
        "/api/zelt/payroll", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listEmployees, \
        "/api/zelt/employees", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listLeave, \
        "/api/zelt/leave", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listExpenses, \
        "/api/zelt/expenses", \
        drogon::Get, "filters::JwtAuthFilter");
