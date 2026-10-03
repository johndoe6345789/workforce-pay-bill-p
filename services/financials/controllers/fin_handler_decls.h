#pragma once
/**
 * @file fin_handler_decls.h
 * @brief Macro expanding to all method declarations
 *        for FinancialsController.
 *        Included by FinancialsController.h.
 */

#include <drogon/HttpRequest.h>
#include <drogon/HttpResponse.h>
#include <functional>
#include <string>

/**
 * @brief Declares all handler methods for the
 *        FinancialsController class body.
 */
// clang-format off
#define FIN_HANDLER_DECLS \
    /** @brief GET /api/financials/burn */ \
    void getBurn( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/financials/burn */ \
    void saveBurn( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief GET /api/financials/unit-econ */ \
    void getUnitEcon( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/financials/unit-econ */ \
    void saveUnitEcon( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief GET /api/financials/pricing */ \
    void getPricing( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/financials/pricing */ \
    void savePricing( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief GET /api/financials/hypotheses */ \
    void listHypotheses( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief POST /api/financials/hypotheses */ \
    void createHypothesis( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT .../hypotheses/{id} */ \
    void updateHypothesis( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief DELETE .../hypotheses/{id} */ \
    void deleteHypothesis( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb, \
        std::string id); \
    /** @brief GET /api/financials/kill-criteria */ \
    void getKillCriteria( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb); \
    /** @brief PUT /api/financials/kill-criteria */ \
    void saveKillCriteria( \
        const drogon::HttpRequestPtr& req, \
        std::function<void( \
            const drogon::HttpResponsePtr&)>&& cb);
// clang-format on
