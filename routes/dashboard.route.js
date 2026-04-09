import { Router } from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import roleGuard from "../middlewares/roleGuard.middleware.js";
import APPSQUADZ from "../helpers/message.helper.js";
import dashboardDomain from "../controller/dashboard.controller.js";
const dashboardRouter = Router();

const {
getCategorySummary,
getMonthlyTrends,
getRecentTransactions,
getSummary
} = dashboardDomain,
{
    ROUTES: {
      DASHBOARD_ENDPOINTS: {
       DSHBRD_SMMRY,
       DSHBRD_CTGRY,
       DSHBRD_RCNT,
       DSHBRD_MNTHLY,
      },
    },
  } = APPSQUADZ;

dashboardRouter.get(DSHBRD_SMMRY, jwtMiddleware.verifyToken, roleGuard.authorize("admin", "analyst", "viewer"),getSummary);
dashboardRouter.get(DSHBRD_CTGRY, jwtMiddleware.verifyToken, roleGuard.authorize("admin", "analyst"),getCategorySummary);
dashboardRouter.get(DSHBRD_RCNT, jwtMiddleware.verifyToken, roleGuard.authorize("admin", "analyst", "viewer"),getRecentTransactions);
dashboardRouter.get(DSHBRD_MNTHLY, jwtMiddleware.verifyToken, roleGuard.authorize("admin", "analyst"),getMonthlyTrends);

export default dashboardRouter;