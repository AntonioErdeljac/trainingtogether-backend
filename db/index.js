const models = require('./models');
const mongoose = require('./mongoose');

module.exports.mongoose = mongoose;

module.exports.Trainings = models.trainings;
module.exports.Users = models.users;
