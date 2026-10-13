#pragma once
/**
 * @file fin_routes.h
 * @brief ADD_METHOD_TO registrations for
 *        FinancialsController.
 *        Included inside METHOD_LIST_BEGIN/END.
 */

// clang-format off
#define FIN_ROUTES(C) \
    ADD_METHOD_TO(C::getBurn, \
        "/api/financials/burn", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::saveBurn, \
        "/api/financials/burn", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::getUnitEcon, \
        "/api/financials/unit-econ", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::saveUnitEcon, \
        "/api/financials/unit-econ", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::getPricing, \
        "/api/financials/pricing", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::savePricing, \
        "/api/financials/pricing", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::listHypotheses, \
        "/api/financials/hypotheses", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::createHypothesis, \
        "/api/financials/hypotheses", \
        drogon::Post, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::updateHypothesis, \
        "/api/financials/hypotheses/{id}", \
        drogon::Put, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::deleteHypothesis, \
        "/api/financials/hypotheses/{id}", \
        drogon::Delete, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::getKillCriteria, \
        "/api/financials/kill-criteria", \
        drogon::Get, "filters::JwtAuthFilter"); \
    ADD_METHOD_TO(C::saveKillCriteria, \
        "/api/financials/kill-criteria", \
        drogon::Put, "filters::JwtAuthFilter");
// clang-format on
