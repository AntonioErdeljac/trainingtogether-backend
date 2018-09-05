const db = require('../../db');
const { errorMessages } = require('../../constants');
const { errors } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    if (!db.mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: errorMessages.TRAINING_404 }).end();
    }

    const training = await db.Trainings.getById(id);

    if (!training) {
      return res.status(400).json({ message: errorMessages.TRAINING_404 }).end();
    }

    return res.status(200).json(training).end();
  } catch (error) {
    return errors.respond(res, error);
  }
};
