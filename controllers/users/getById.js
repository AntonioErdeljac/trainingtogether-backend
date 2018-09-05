const db = require('../../db');
const { errorMessages } = require('../../constants');
const { errors } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    if (!db.mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: errorMessages.USER_404 }).end();
    }

    const user = await db.Users.getById(id);

    if (!user) {
      return res.status(400).json({ message: errorMessages.USER_404 }).end();
    }

    return res.status(200).json(user).end();
  } catch (error) {
    return errors.respond(res, error);
  }
};
