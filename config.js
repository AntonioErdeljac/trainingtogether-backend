const domain = process.env.DOMAIN || 'localhost';
const protocol = process.env.PROTOCOL || 'http://';
const port = process.env.PORT || 3000;

module.exports.domain = domain;
module.exports.port = port;
module.exports.protocol = protocol;

module.exports.serverUrl = `${protocol}${domain}${port ? `:${port}` : ''}`;

module.exports.mongo = {
  uri: process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/trainingTogether',
};
