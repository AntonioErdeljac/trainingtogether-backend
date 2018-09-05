const _ = require('lodash');

const db = require('../../db');
const { errorMessages } = require('../../constants');
const { errors } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.identity;

    if (!db.mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: errorMessages.USER_404 }).end();
    }

    if (id !== user._id.toString()) {
      return res.status(403).json({ message: errorMessages.USER_403 }).end();
    }

    const foundUser = await db.Users.getById(id);

    if (!foundUser) {
      return res.status(400).json({ message: errorMessages.USER_400 }).end();
    }

    _.merge(foundUser, req.body);

    if (!db.Users.isValid(foundUser)) {
      return res.status(400).json({ message: errorMessages.USER_400 }).end();
    }

    const updatedUser = await db.Users.updateById(id, foundUser);

    if (!updatedUser) {
      return res.status(400).json({ message: errorMessages.USER_404 }).end();
    }

    return res.status(200).json(updatedUser).end();
  } catch (error) {
    return errors.respond(res, error);
  }
};
