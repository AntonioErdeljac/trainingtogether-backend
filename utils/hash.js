const crypto = require('crypto');

const PRIVATE_KEY = '6F6D6E692E7369676E65742E7574696C';

module.exports.authentication = (token, user) => crypto.createHmac('sha256', [token, user].join('/')).update(PRIVATE_KEY).digest('hex').toLowerCase();

module.exports.password = (token, password) => crypto.createHmac('sha256', [token, password].join('/')).update(PRIVATE_KEY).digest('hex').toUpperCase();
