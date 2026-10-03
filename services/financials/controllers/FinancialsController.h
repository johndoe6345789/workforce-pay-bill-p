#pragma once
/**
 * @file FinancialsController.h
 * @brief REST endpoints for financials domain:
 *        burn rate, unit econ, pricing, hypotheses,
 *        kill criteria. All routes require JwtAuthFilter.
 *        Routes: fin_routes.h. Decls: fin_handler_decls.h
 *        Implementations split across five .cpp files.
 */

#include "fin_routes.h"
#include "fin_handler_decls.h"

#include "financials/backend/BurnService.h"
#include "financials/backend/UnitEconService.h"
#include "financials/backend/PricingService.h"
#include "financials/backend/HypothesisService.h"
#include "financials/backend/KillCriteriaService.h"

#include <drogon/HttpController.h>

namespace controllers
{

/**
 * @brief Controller for /api/financials/*.
 *        Implementations are in five .cpp files.
 */
class FinancialsController
    : public drogon::HttpController<
          FinancialsController>
{
  public:
    METHOD_LIST_BEGIN
    FIN_ROUTES(FinancialsController)
    METHOD_LIST_END

    FIN_HANDLER_DECLS

  private:
    services::financials::BurnService burn_;
    services::financials::UnitEconService unitEcon_;
    services::financials::PricingService pricing_;
    services::financials::HypothesisService
        hypotheses_;
    services::financials::KillCriteriaService
        killCriteria_;
};

} // namespace controllers
