import mongoose from "mongoose";
import financeService from "../services/finance.service.js";
import responseHelper from "../helpers/response.helper.js";
import {
  dateFilterSchema,
  trendQuerySchema,
  recentQuerySchema,
} from "../validators/dashboard.validator.js";

const { send200, send400, send500 } = responseHelper;

const {
  getFinanceSummary,
  getFinanceCategorySummary,
  getFinanceMonthlyTrends,
  getFinanceRecentTransactions,
} = financeService;


const buildMatchFilter = (userId, startDate, endDate) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId),
    isDeleted: false,
  };

  if (startDate || endDate) {
    match.date = {};

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      match.date.$gte = start;
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      match.date.$lte = end;
    }
  }

  return match;
};


const getSummary = async (req, res) => {
  try {
    const { error, value } = dateFilterSchema.validate(req.query);
    if (error) return send400(res, { message: error.details[0].message });

    const { startDate, endDate } = value;

    const match = buildMatchFilter(req.user._id, startDate, endDate);

    const result = await getFinanceSummary(match);

    let totalIncome = 0;
    let totalExpense = 0;

    result.forEach((item) => {
      if (item._id === "income") totalIncome = item.total;
      if (item._id === "expense") totalExpense = item.total;
    });

    return send200(res, {
      status: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
      },
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
};


const getCategorySummary = async (req, res) => {
  try {
    const { error, value } = dateFilterSchema.validate(req.query);
    if (error) return send400(res, { message: error.details[0].message });

    const { startDate, endDate } = value;

    const match = buildMatchFilter(req.user._id, startDate, endDate);

    const result = await getFinanceCategorySummary(match);

    return send200(res, {
      status: true,
      data: result,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const getRecentTransactions = async (req, res) => {
  try {
    const { error, value } = recentQuerySchema.validate(req.query);
    if (error) return send400(res, { message: error.details[0].message });

    const { limit = 5 } = value;

    const filter = {
      userId: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: false,
    };

    const records = await getFinanceRecentTransactions(filter, limit);

    return send200(res, {
      status: true,
      data: records,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
};


const getMonthlyTrends = async (req, res) => {
  try {
    const { error, value } = trendQuerySchema.validate(req.query);
    if (error) return send400(res, { message: error.details[0].message });

    const { year } = value;

    const match = {
      userId: new mongoose.Types.ObjectId(req.user._id),
      isDeleted: false,
    };

    if (year) {
      match.date = {
        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
        $lte: new Date(`${year}-12-31T23:59:59.999Z`),
      };
    }

    const result = await getFinanceMonthlyTrends(match);

    return send200(res, {
      status: true,
      data: result,
    });

  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const dashboardDomain = {
  getSummary,
  getCategorySummary,
  getRecentTransactions,
  getMonthlyTrends,
};

export default dashboardDomain;