const _ = require('lodash');

const db = require('../../db');
const { errorMessages } = require('../../constants');
const { errors } = require('../../utils');

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { user } = req.identity;

    if (!db.mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: errorMessages.TRAINING_404 }).end();
    }

    const foundTraining = await db.Trainings.getById(id);

    if (!foundTraining) {
      return res.status(400).json({ message: errorMessages.TRAINING_400 }).end();
    }

    if (foundTraining.author.toString() !== user._id.toString()) {
      return res.status(403).json({ message: errorMessages.TRAINING_403 }).end();
    }

    _.merge(foundTraining, _.omit(req.body, ['author']));

    if (!db.Trainings.isValid(foundTraining)) {
      return res.status(400).json({ message: errorMessages.TRAINING_400 }).end();
    }

    const updatedTraining = await db.Trainings.updateById(id, foundTraining);

    if (!updatedTraining) {
      return res.status(400).json({ message: errorMessages.TRAINING_404 }).end();
    }

    return res.status(200).json(updatedTraining).end();
  } catch (error) {
    return errors.respond(res, error);
  }
};
