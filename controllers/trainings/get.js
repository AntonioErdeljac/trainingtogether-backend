const db = require('../../db');
const { errorMessages } = require('../../constants');
const { errors } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const trainings = await db.Trainings.get();

    if (!trainings) {
      return res.status(400).json({ message: errorMessages.TRAINING_404 }).end();
    }

    return res.status(200).json(trainings).end();
  } catch (error) {
    return errors.respond(res, error);
  }
};
