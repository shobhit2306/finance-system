import { Router } from "express";
import jwtMiddleware from "../middlewares/jwt.middleware.js";
import roleGuard from "../middlewares/roleGuard.middleware.js";
import financeDomain from "../controller/finance.controller.js";
import APPSQUADZ from "../helpers/message.helper.js";

const financeRouter = Router();

const {
  createFinanceRecord,
  getFinanceRecords,
  getSingleFinance,
  updateFinanceRecord,
  deleteFinanceRecord,
} = financeDomain,
{
    ROUTES: {
      FINANCE_ENDPOINTS: {
       CREATE_RECORD,
       ALL_RECORD,
       SINGLE_RECORD,
       UPDATE_RECORD,
       DELETE_RECORD
      },
    },
  } = APPSQUADZ;

financeRouter.post(
  CREATE_RECORD,
  jwtMiddleware.verifyToken,
  roleGuard.authorize("admin"),
  createFinanceRecord
);

financeRouter.get(
  ALL_RECORD,
  jwtMiddleware.verifyToken,
  roleGuard.authorize("admin", "analyst"),
  getFinanceRecords
);

financeRouter.get(
  SINGLE_RECORD,
  jwtMiddleware.verifyToken,
  roleGuard.authorize("admin", "analyst"),
  getSingleFinance
);

financeRouter.put(
  UPDATE_RECORD,
  jwtMiddleware.verifyToken,
  roleGuard.authorize("admin"),
  updateFinanceRecord
);

financeRouter.delete(
  DELETE_RECORD,
  jwtMiddleware.verifyToken,
  roleGuard.authorize("admin"),
  deleteFinanceRecord
);

export default financeRouter;