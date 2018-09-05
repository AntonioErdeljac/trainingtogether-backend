const authentication = require('./authentication');
const trainings = require('./trainings');
const users = require('./users');

module.exports = (router) => {
  authentication(router);
  trainings(router);
  users(router);
};
