/**
 * @file hypothesis_read.cpp
 * @brief HypothesisService list + create methods.
 */

#include "HypothesisService.h"
#include "hypothesis_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void HypothesisService::listHypotheses(
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "SELECT id::text, user_id::text,"
        " assumption, test_method, result,"
        " status, created_at::text,"
        " updated_at::text"
        " FROM financial_hypotheses"
        " WHERE user_id=$1::uuid"
        " ORDER BY created_at DESC";
    db()->execSqlAsync(
        sql,
        [ok](const Result& res) {
            json arr = json::array();
            for (const auto& r : res)
                arr.push_back(
                    hypothesisRowToJson(r));
            ok(std::move(arr));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("listHypotheses: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId);
}

void HypothesisService::createHypothesis(
    const std::string& userId,
    const json& body,
    Callback ok,
    ErrCallback err)
{
    auto assumption = body.value(
        "assumption", std::string{});
    auto method = body.value(
        "testMethod", std::string{});
    auto result = body.value(
        "result", std::string{});
    auto status = body.value(
        "status", std::string{"untested"});
    const auto sql =
        "INSERT INTO financial_hypotheses"
        " (user_id, assumption, test_method,"
        "  result, status)"
        " VALUES ($1::uuid,$2,$3,$4,$5)"
        " RETURNING id::text, user_id::text,"
        "  assumption, test_method, result,"
        "  status, created_at::text,"
        "  updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k500InternalServerError,
                    "insert failed");
                return;
            }
            ok(hypothesisRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("createHypothesis: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        userId, assumption, method, result, status);
}

} // namespace services::financials
