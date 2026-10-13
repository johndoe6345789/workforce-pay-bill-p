/**
 * @file hypothesis_write.cpp
 * @brief HypothesisService update + delete methods.
 */

#include "HypothesisService.h"
#include "hypothesis_row.h"
#include <drogon/orm/Result.h>
#include <spdlog/spdlog.h>

namespace services::financials
{

using drogon::orm::Result;

void HypothesisService::updateHypothesis(
    const std::string& id,
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
        "UPDATE financial_hypotheses SET"
        "  assumption=$3, test_method=$4,"
        "  result=$5, status=$6,"
        "  updated_at=NOW()"
        " WHERE id=$1::uuid"
        "  AND user_id=$2::uuid"
        " RETURNING id::text, user_id::text,"
        "  assumption, test_method, result,"
        "  status, created_at::text,"
        "  updated_at::text";
    db()->execSqlAsync(
        sql,
        [ok, err](const Result& res) {
            if (res.empty()) {
                err(drogon::k404NotFound,
                    "hypothesis not found");
                return;
            }
            ok(hypothesisRowToJson(res[0]));
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("updateHypothesis: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId,
        assumption, method, result, status);
}

void HypothesisService::deleteHypothesis(
    const std::string& id,
    const std::string& userId,
    Callback ok,
    ErrCallback err)
{
    const auto sql =
        "DELETE FROM financial_hypotheses"
        " WHERE id=$1::uuid AND user_id=$2::uuid";
    db()->execSqlAsync(
        sql,
        [ok](const Result&) {
            ok(json::object());
        },
        [err](
            const drogon::orm::DrogonDbException& e) {
            spdlog::error("deleteHypothesis: {}",
                          e.base().what());
            err(drogon::k500InternalServerError,
                e.base().what());
        },
        id, userId);
}

} // namespace services::financials
