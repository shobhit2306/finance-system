const createOne = async (model, data) => {
    return await model.create({ ...data });
  },
  createMany = async (model, data) => {
    return await model.insertMany([...data]);
  },
  retrieveById = async (model, id) => {
    return await model.findById(id);
  },
  retrieveOne = async (model, filter, populate = undefined) => {
    const data = await model.findOne({ ...filter });
    if (populate) await data.populate(populate);
    return data;
  },
  updateOne = async (model, filter, data) => {
    return await model.findOneAndUpdate(
      { ...filter },
      { ...data },
      { new: true }
    );
  },
  upsertOne = async (model, filter, update) => {
    return await model.findOneAndUpdate(
      { ...filter },
      { ...update },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );
  },
  modUpsertOne = async (model, filter, update) => {
    return await model.updateOne({ ...filter }, [{ $set: { ...update } }], {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  },
  updateMany = async (model, filter, data) => {
    return await model.update({ ...filter }, { ...data }, { multi: true });
  },
  deleteOne = async (model, filter) => {
    return await model.deleteOne({ ...filter });
  },
  deleteMany = async (model, filter) => {
    return await model.deleteMany({ ...filter });
  },
  retrieveManyWithPagination = async (
    model,
    filter,
    sort,
    limit,
    offset,
    select = undefined,
    populate = undefined
  ) => {
    return await model.paginate(
      { ...filter },
      { sort, limit, offset, select, populate }
    );
  },
  retrieveMany = async (model, filter, sort, populate = undefined) => {
    const data = await model.find({ ...filter }).sort({ ...sort });
    if (populate) await data.populate(populate);
    return data;
  },
  countData = async (model, filter) => {
    return await model.find({ ...filter }).count();
  },
  commonHelper = {
    countData,
    createOne,
    createMany,
    retrieveById,
    retrieveMany,
    retrieveOne,
    updateOne,
    deleteOne,
    deleteMany,
    modUpsertOne,
    upsertOne,
    retrieveManyWithPagination,
    updateMany,
  };
export default commonHelper;
