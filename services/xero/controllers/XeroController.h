#pragma once
/**
 * @file XeroController.h
 * @brief Drogon controller for /api/xero/* endpoints.
 */

#include <drogon/HttpController.h>
#include "xero_routes.h"
#include "xero_handler_decls.h"
#include "xero/backend/XeroStore.h"

namespace controllers
{

/**
 * @brief Routes all Xero API and OAuth endpoints.
 */
class XeroController
    : public drogon::HttpController<XeroController>
{
  public:
    METHOD_LIST_BEGIN
    XERO_ROUTES(XeroController)
    METHOD_LIST_END

    XERO_HANDLER_DECLS

  private:
    services::xero::XeroStore svc_;
};

} // namespace controllers
