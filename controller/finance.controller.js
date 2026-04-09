
import responseHelper from "../helpers/response.helper.js";
import financeService from "../services/finance.service.js";
import {
  createFinanceSchema,
  updateFinanceSchema,
  financeQuerySchema,
} from "../validators/finance.validator.js";

const { send200, send400, send500, send403 } = responseHelper;

const {
  createFinance,
  retrieveAllFinances,
  retrieveFinanceById,
  updateFinance,
  deleteFinanceById,
} = financeService;

const createFinanceRecord = async (req, res) => {
  try {

    const { error, value } = createFinanceSchema.validate(req.body);
    if (error) {
      return send400(res, { message: error.details[0].message });
    }

    if (req.user.role !== "admin") {
      return send403(res, { message: "Only admin can create records" });
    }

    const record = await createFinance({
      userId: req.user._id,
      ...value,
    });

    return send200(res, {
      status: true,
      message: "Record created",
      data: record,
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const getFinanceRecords = async (req, res) => {
  try {
    const { error, value } = financeQuerySchema.validate(req.query);
    if (error) {
      return send400(res, { message: error.details[0].message });
    }

    const {
      page = 1,
      limit = 10,
      type,
      category,
      startDate,
      endDate,
      sortBy = "createdAt",
      order = "desc",
    } = value;

    const query = {
      isDeleted: false,
      userId: req.user._id,
    };

    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const parsedLimit = Number(limit);
    const parsedPage = Number(page);
    const offset = (parsedPage - 1) * parsedLimit;

    const records = await retrieveAllFinances(
      query,
      sort,
      parsedLimit,
      offset,
      "amount type category date note createdAt"
    );

    return send200(res, {
      status: true,
      data: records.docs,
      meta: {
        total: records.totalDocs,
        page: records.page,
        limit: records.limit,
        totalPages: records.totalPages,
      },
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const getSingleFinance = async (req, res) => {
  try {
    const record = await retrieveFinanceById({
      _id: req.params.id,
      isDeleted: false,
      userId: req.user._id,
    });

    if (!record) {
      return send400(res, { message: "Record not found" });
    }

    return send200(res, {
      status: true,
      data: record,
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const updateFinanceRecord = async (req, res) => {
  try {
    const { error, value } = updateFinanceSchema.validate(req.body);
    if (error) {
      return send400(res, { message: error.details[0].message });
    }

    if (req.user.role !== "admin") {
      return send403(res, { message: "Only admin can update" });
    }

    const record = await updateFinance(
      {
        _id: req.params.id,
        userId: req.user._id,
        isDeleted: false,
      },
      value
    );

    return send200(res, {
      status: true,
      message: "Record updated",
      data: record,
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const deleteFinanceRecord = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return send403(res, { message: "Only admin can delete" });
    }

    await deleteFinanceById(
      {
        _id: req.params.id
      },
      { isDeleted: true }
    );

    return send200(res, {
      status: true,
      message: "Record deleted",
    });
  } catch (error) {
    return send500(res, { message: error.message });
  }
};

const financeDomain = {
  createFinanceRecord,
  getFinanceRecords,
  getSingleFinance,
  updateFinanceRecord,
  deleteFinanceRecord,
};

export default financeDomain;