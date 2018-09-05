const { authentication } = require('../../controllers');
const { paths } = require('../../constants');

module.exports = (router) => {
  router.post(paths.api.v1.AUTHENTICATION_LOGIN, authentication.login);

  router.post(paths.api.v1.AUTHENTICATION_REGISTRATION, authentication.register);
};
