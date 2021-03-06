const db = require('../../db');
const { errorMessages, cookies } = require('../../constants');
const { errors, hash, tokens, build } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: errorMessages.USER_400 });
    }

    const user = await db.Users.getByEmail(email)
      .select('+authentication.password +authentication.salt');

    if (!user) {
      return res.status(400).json({ message: errorMessages.LOGIN_400 }).end();
    }

    if (user.authentication.password !== hash.password(user.authentication.salt, password)) {
      return res.status(400).json({ message: errorMessages.LOGIN_400 }).end();
    }

    user.authentication.sessionToken = hash.authentication(tokens.generate(), user._id);

    res.cookie(cookies.AUTHENTICATION, user.authentication.sessionToken, build.cookieOptions());

    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    return errors.respond(res, error);
  }
};
