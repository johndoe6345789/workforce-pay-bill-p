#pragma once
/**
 * @file ZeltController.h
 * @brief Drogon controller for /api/zelt/* endpoints.
 */

#include <drogon/HttpController.h>
#include "zelt_routes.h"
#include "zelt_handler_decls.h"
#include "zelt/backend/ZeltStore.h"

namespace controllers
{

/** @brief Routes all Zelt API and config endpoints. */
class ZeltController
    : public drogon::HttpController<ZeltController>
{
  public:
    METHOD_LIST_BEGIN
    ZELT_ROUTES(ZeltController)
    METHOD_LIST_END

    ZELT_HANDLER_DECLS

  private:
    services::zelt::ZeltStore svc_;
};

} // namespace controllers
