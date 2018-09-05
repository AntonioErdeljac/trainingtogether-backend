const _ = require('lodash');
const mongoose = require('mongoose');

const schemaTypes = require('./schemaTypes');

const { Schema } = mongoose;

const Users = mongoose.model('users', new Schema({
  authentication: {
    password: schemaTypes.string({ select: false }),
    salt: schemaTypes.string({ select: false }),
    sessionToken: schemaTypes.string({ select: false }),
  },
  address: {
    city: schemaTypes.string(),
    country: schemaTypes.string(),
    postalCode: schemaTypes.string(),
    street: schemaTypes.string(),
  },
  confirmEmailRequest: {
    token: schemaTypes.string({ select: false }),
  },
  contact: {
    email: schemaTypes.string({ required: true, unique: true }),
    newEmail: schemaTypes.string(),
    phoneNumber: schemaTypes.string(),
  },
  inRegistrationFlow: schemaTypes.boolean({ default: false }),
  resetPasswordRequest: {
    requestedAt: schemaTypes.date({ select: false }),
    token: schemaTypes.string({ select: false }),
  },

  __v: schemaTypes.number({ select: false }),
  createdAt: schemaTypes.date({ select: false }),
  updatedAt: schemaTypes.date({ select: false }),
}, { timestamps: true }));

module.exports.isValid = values => !Users(values).validateSync();

module.exports.create = (values) => {
  const user = _.omit(values, ['_id', 'locale']);

  return Users(user).save()
    .then(newUser => Promise.resolve(_.omit(newUser.toObject(), ['authentication'])));
};

module.exports.get = (options = {}) => {
  const { account, excludedUserId, keyword, limit, page } = options;

  const query = {};

  if (account) {
    query.account = account;
  }

  if (excludedUserId) {
    query._id = { $ne: excludedUserId };
  }

  if (keyword) {
    query.$or = [
      { 'contact.email': new RegExp(_.escapeRegExp(_.trim(keyword)), 'i') },
      { 'personal.firstName': new RegExp(_.escapeRegExp(_.trim(keyword)), 'i') },
      { 'personal.lastName': new RegExp(_.escapeRegExp(_.trim(keyword)), 'i') },
      { 'personal.nin': new RegExp(_.escapeRegExp(_.trim(keyword)), 'i') },
    ];
  }

  return Promise.all([
    Users.find(query)
      .sort({ 'personal.firstName': 1, 'personal.lastName': 1 })
      .skip(parseInt(limit, 10) * (parseInt(page, 10)))
      .limit(parseInt(limit, 10)),
    Users.countDocuments(query),
  ])
    .then(([data, total]) => Promise.resolve({ data, total, page, limit }));
};

module.exports.getByEmail = (email, options = {}) => {
  const { account, excludedUserId } = options;

  const query = { 'contact.email': new RegExp(`^${_.escapeRegExp(_.trim(email))}$`, 'i') };

  if (account) {
    query.account = account;
  }

  if (excludedUserId) {
    query._id = { $ne: excludedUserId };
  }

  return Users.findOne(query);
};

module.exports.getByEmailToken = (token) => {
  const query = { 'confirmEmailRequest.token': token };

  return Users.findOne(query);
};

module.exports.getById = (id, options = {}) => {
  const { account } = options;

  const query = { _id: id };

  if (account) {
    query.account = account;
  }

  return Users.findOne(query);
};

module.exports.getByIds = (ids, options = {}) => {
  const { account } = options;

  const query = { _id: { $in: ids } };

  if (account) {
    query.account = account;
  }

  return Users.find(query);
};

module.exports.getByPasswordToken = (token) => {
  const query = { 'resetPasswordRequest.token': token };

  return Users.findOne(query);
};

module.exports.getBySessionToken = (token) => {
  const query = { 'authentication.sessionToken': token };

  return Users.findOne(query);
};

module.exports.getByRoles = (ids, options = {}) => {
  const { account } = options;

  const query = { role: { $in: ids } };

  if (account) {
    query.account = account;
  }

  return Users.find(query);
};

module.exports.updateById = (id, values) => {
  const user = _.omit(values, ['_id']);

  const query = {
    _id: id,
  };

  return Users.findOneAndUpdate(query, { $set: user }, { new: true });
};

module.exports.updateByIds = (ids, values, options = {}) => {
  const { account } = options;

  const query = { _id: { $in: ids } };

  if (account) {
    query.account = account;
  }

  return Users.update(query, { $set: values }, { multi: true });
};

module.exports.removeByIds = (ids, options = {}) => {
  const { account } = options;

  const query = { _id: { $in: ids } };

  if (account) {
    query.account = account;
  }

  return Users.remove(query);
};
