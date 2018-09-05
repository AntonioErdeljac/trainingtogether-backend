const { users } = require('../../controllers');
const { paths } = require('../../constants');
const { authenticate } = require('../middlewares');

module.exports = (router) => {
  router.get(paths.api.v1.USERS_ID, authenticate, users.getById);

  router.put(paths.api.v1.USERS_ID, authenticate, users.updateById);
};
