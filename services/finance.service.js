
import commonHelper from "../helpers/db.common.helper.js";
import financeModel from "../models/finance.model.js";

const {
  createOne,
  retrieveOne,
  updateOne,
  upsertOne,
  updateMany,
  retrieveById,
  retrieveMany,
  deleteOne,
  modUpsertOne,
  deleteMany,
  retrieveManyWithPagination
} = commonHelper;


const createFinance = async (data) => {
  return await createOne(financeModel, { ...data });
};

const retrieveFinance = async (filter) => {
  return await retrieveOne(financeModel, { ...filter });
};

const retrieveFinanceById = async (financeId) => {
  return await retrieveById(financeModel, financeId);
};

const retrieveFinances = async (filter, sort) => {
  return await retrieveMany(financeModel, { ...filter }, { ...sort }, undefined);
};

const retrieveAllFinances = async (filter, sort, limit, offset, select) => {
  return await retrieveManyWithPagination(
    financeModel,
    { ...filter },
    { ...sort },
    limit,
    offset,
    select
  );
};

const updateFinance = async (filter, data) => {
  return await updateOne(financeModel, { ...filter }, { ...data });
};

const upsertFinance = async (filter, data) => {
  return await upsertOne(financeModel, { ...filter }, { ...data });
};

const modUpsertFinance = async (filter, data) => {
  return await modUpsertOne(financeModel, { ...filter }, { ...data });
};

const updateMultipleFinances = async (filter, data) => {
  return await updateMany(financeModel, { ...filter }, { ...data });
};


const deleteFinanceById = async (financeId) => {
  return await deleteOne(financeModel, { _id: financeId });
};

const deleteMultipleFinances = async (ids) => {
  return await deleteMany(financeModel, { _id: { $in: [...ids] } });
};

const getFinanceSummary = async (match) => {
  return await financeModel.aggregate([
    { $match: { ...match } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);
};

const getFinanceCategorySummary = async (match) => {
  return await financeModel.aggregate([
    { $match: { ...match } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        category: "$_id",
        total: 1,
        _id: 0,
      },
    },
  ]);
};

const getFinanceMonthlyTrends = async (match) => {
  return await financeModel.aggregate([
    { $match: { ...match } },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        month: "$_id.month",
        type: "$_id.type",
        total: 1,
        _id: 0,
      },
    },
    { $sort: { month: 1 } },
  ]);
};

const getFinanceRecentTransactions = async (filter, limit) => {
  return await retrieveMany(
    financeModel,
    { ...filter },
    { date: -1 }
  ).then((data) => data.slice(0, limit));
};

// EXPORT
const financeService = {
  createFinance,
  retrieveFinance,
  retrieveFinanceById,
  retrieveFinances,
  retrieveAllFinances,
  updateFinance,
  upsertFinance,
  modUpsertFinance,
  updateMultipleFinances,
  deleteFinanceById,
  deleteMultipleFinances,
  getFinanceRecentTransactions,
  getFinanceMonthlyTrends,
  getFinanceCategorySummary,
  getFinanceSummary
};

export default financeService;