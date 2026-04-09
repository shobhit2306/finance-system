import userModel from "../models/user.model.js";
import commonHelper from "../helpers/db.common.helper.js";

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

const createUser = async (data) => {
    return await createOne(userModel, { ...data });
  },
  retrieveUserByEmail = async (email) => {
    return await retrieveOne(userModel, { email });
  },
    retrieveUserByPhone = async (phone) => {
    return await retrieveOne(userModel, { phoneNo:phone });
  },
  retrieveUserById = async (userId) => {
    return await retrieveById(userModel, userId);
  },
  deleteUserById = async (userId) => {
    return await deleteOne(userModel, { _id: userId });
  },
  deleteMultipleUsers = async (data) => {
    return await deleteMany(userModel, { _id: { $in: [...data] } });
  },
  retrieveUsers = async (filter, sort) => {
    return await retrieveMany(userModel, { ...filter }, { ...sort }, undefined);
  },
  retrieveUser = async (filter) => {
    return await retrieveOne(userModel, { ...filter });
  },
  retrieveAllUsers = async (filter, sort, limit, offset, select) => {
      return await retrieveManyWithPagination(
        userModel,
        { ...filter },
        { ...sort },
        limit,
        offset,
        select
      );
    },
  updateUser = async (filter, data) => {
    return await updateOne(userModel, { ...filter }, { ...data });
  },
  upsertUser = async (filter, data) => {
    return await upsertOne(userModel, { ...filter }, { ...data });
  },
  modUpsertUser = async (filter, data) => {
    return await modUpsertOne(userModel, { ...filter }, { ...data });
  },
  suspendMultipleUsers = async (filter, data) => {
    return await updateMany(userModel, { ...filter }, { ...data });
  },
  userService = {
    createUser,
    retrieveUserByEmail,
    retrieveUser,
    modUpsertUser,
    updateUser,
    upsertUser,
    retrieveUserById,
    retrieveUsers,
    deleteUserById,
    deleteMultipleUsers,
    suspendMultipleUsers,
    retrieveUserByPhone,
    retrieveAllUsers
  };

export default userService;
