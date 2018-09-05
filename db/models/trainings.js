const _ = require('lodash');
const mongoose = require('mongoose');

const schemaTypes = require('./schemaTypes');

const { Schema } = mongoose;

const Trainings = mongoose.model('trainings', new Schema({
  title: schemaTypes.string({ required: true }),
  author: { ref: 'users', type: Schema.Types.ObjectId },

  __v: schemaTypes.number({ select: false }),
  createdAt: schemaTypes.date({ select: false }),
  updatedAt: schemaTypes.date({ select: false }),
}, { timestamps: true }));

module.exports.isValid = values => !Trainings(values).validateSync();

module.exports.create = (values) => {
  const training = _.omit(values, ['_id']);

  return Trainings(training).save()
    .then(newTraining => Promise.resolve(newTraining));
};

module.exports.get = (options = {}) => {
  const { keyword, limit, page } = options;

  const query = {};

  if (keyword) {
    query.$or = [
      { title: new RegExp(_.escapeRegExp(_.trim(keyword)), 'i') },
    ];
  }

  return Promise.all([
    Trainings.find(query)
      .sort({ title: 1 })
      .skip(parseInt(limit, 10) * (parseInt(page, 10)))
      .limit(parseInt(limit, 10)),
    Trainings.countDocuments(query),
  ])
    .then(([data, total]) => Promise.resolve({ data, total, page, limit }));
};

module.exports.getById = (id) => {
  const query = { _id: id };

  return Trainings.findOne(query);
};

module.exports.getByIds = (ids) => {
  const query = { _id: { $in: ids } };

  return Trainings.find(query);
};

module.exports.updateById = (id, values) => {
  const training = _.omit(values, ['_id']);

  const query = {
    _id: id,
  };

  return Trainings.findOneAndUpdate(query, { $set: training }, { new: true });
};

module.exports.updateByIds = (ids, values) => {
  const query = { _id: { $in: ids } };

  return Trainings.update(query, { $set: values }, { multi: true });
};

module.exports.removeByIds = (ids) => {
  const query = { _id: { $in: ids } };

  return Trainings.remove(query);
};
