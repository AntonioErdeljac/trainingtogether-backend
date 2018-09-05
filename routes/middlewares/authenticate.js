const db = require('../../db');
const { build } = require('../../utils');

const { cookies, headers } = require('../../constants');

module.exports = async (req, res, next) => {
  try {
    const isBrowser = req.cookies;

    if (isBrowser) {
      if (req.cookies[cookies.AUTHENTICATION] && !req.headers[headers.AUTHENTICATION]) {
        return res.sendStatus(403);
      }
    } else if (!req.headers[headers.AUTHENTICATION]) {
      return res.sendStatus(403);
    }

    const user = await db.Users.getBySessionToken(isBrowser ? req.cookies[cookies.AUTHENTICATION] : req.headers[headers.AUTHENTICATION]).lean();

    if (!user) {
      res.clearCookie(cookies.AUTHENTICATION, build.cookieOptions());

      if (req.path.indexOf('/api/') === 0) {
        return res.status(401).end();
      }

      return res.sendStatus(403);
    }

    req.identity = { user };

    return next();
  } catch (e) {
    return res.status(500).end();
  }
};
