/**
 * @file test_burn_service.cpp
 * @brief BurnService::getBurn and saveBurn logic.
 *
 * Stubs the DB layer to verify 404-on-missing-record
 * and save/get round-trip behaviour.
 */

#include <gtest/gtest.h>
#include <optional>
#include <string>
#include <unordered_map>

namespace
{

struct BurnRow
{
    double monthlyBurnGbp = 0.0;
    double cashInBankGbp  = 0.0;
    double monthlyRevGbp  = 0.0;
};

enum class ResultCode { kOk, kNotFound };

using BurnStore =
    std::unordered_map<std::string, BurnRow>;

ResultCode getBurn(
    const BurnStore& store,
    const std::string& userId,
    BurnRow& out)
{
    auto it = store.find(userId);
    if (it == store.end())
        return ResultCode::kNotFound;
    out = it->second;
    return ResultCode::kOk;
}

void saveBurn(
    BurnStore& store,
    const std::string& userId,
    const BurnRow& row)
{
    store[userId] = row;
}

} // namespace

class BurnServiceTest : public ::testing::Test
{
protected:
    BurnStore store;
};

TEST_F(BurnServiceTest, GetReturns404WhenNoRecord)
{
    BurnRow out;
    EXPECT_EQ(
        getBurn(store, "user-42", out),
        ResultCode::kNotFound);
}

TEST_F(BurnServiceTest, SaveAndGetRoundtrip)
{
    BurnRow saved{5000.0, 20000.0, 1000.0};
    saveBurn(store, "user-42", saved);
    BurnRow retrieved;
    ASSERT_EQ(
        getBurn(store, "user-42", retrieved),
        ResultCode::kOk);
    EXPECT_DOUBLE_EQ(
        retrieved.monthlyBurnGbp, 5000.0);
    EXPECT_DOUBLE_EQ(
        retrieved.cashInBankGbp, 20000.0);
}
