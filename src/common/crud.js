const { errData, errorRes, successRes } = require('../common/response');
const mongoose = require('mongoose');

const create = (model, populate = []) => {
  return async (req, res) => {
    try {
      const newData = new model({
        _id: new mongoose.Types.ObjectId(),
        ...req.body,
      });
      const savedData = await newData.save();
      const populatedData = await model
        .findOne({ _id: savedData._id })
        .populate(...populate)
        .exec();
      successRes(res, populatedData);
    } catch (error) {
      errorRes(res, error);
    }
  };
};

const read = (model, populate = []) => {
  return async (req, res) => {
    try {
      const data = await model.find(req.body).populate(...populate);
      successRes(res, data);
    } catch (error) {
      errorRes(res, error);
    }
  };
};

const readOne = (model, populate = []) => {
  return async (req, res) => {
    try {
      const data = await model.findOne(req.body).populate(...populate);
      successRes(res, data);
    } catch (error) {
      errorRes(res, error);
    }
  };
};

const update = (model, populate = []) => {
  return async (req, res) => {
    try {
      req.body.updated_at = new Date();
      const updatedData = await model.findByIdAndUpdate(req.params._id, req.body, { new: true }).populate(...populate);
      successRes(res, updatedData);
    } catch (error) {
      errorRes(res, error);
    }
  };
};

const remove = (model) => {
  return async (req, res) => {
    try {
      await model.deleteOne({ _id: req.params._id });
      successRes(res, { message: 'success' });
    } catch (error) {
      errorRes(res, error);
    }
  };
};

module.exports = { read, readOne, create, update, remove };
