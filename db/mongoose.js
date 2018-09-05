const mongoose = require('mongoose');

const config = require('../config');

mongoose.Promise = Promise;
mongoose.connect(config.mongo.uri, { useNewUrlParser: true });
mongoose.connection.on('error', error => console.error(error));

module.exports = mongoose;
