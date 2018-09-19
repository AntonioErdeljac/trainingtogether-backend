const { trainings } = require('../../controllers');
const { paths } = require('../../constants');
const { authenticate } = require('../middlewares');

module.exports = (router) => {
  router.get(paths.api.v1.TRAININGS, authenticate, trainings.get);
  router.post(paths.api.v1.TRAININGS, authenticate, trainings.create);

  router.get(paths.api.v1.TRAININGS_ID, authenticate, trainings.getById);
  router.put(paths.api.v1.TRAININGS_ID, authenticate, trainings.updateById);

  router.patch('/test', req => console.log(req.body));
};
