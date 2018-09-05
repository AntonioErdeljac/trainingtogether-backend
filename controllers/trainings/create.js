const db = require('../../db');
const { errorMessages } = require('../../constants');
const { errors } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const { user } = req.identity;

    if (!db.Trainings.isValid(req.body)) {
      return res.status(400).json({ message: errorMessages.TRAINING_400 }).end();
    }

    const training = await db.Trainings.create({ ...req.body, author: user._id });

    if (!training) {
      return res.status(400).json({ message: errorMessages.TRAINING_404 }).end();
    }

    return res.status(200).json(training).end();
  } catch (error) {
    return errors.respond(res, error);
  }
};
