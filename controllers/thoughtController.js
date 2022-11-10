const { Thought, User } = require('../models');

module.exports = {
  //get all thought
  getAllThought: function (req, res) {
    Thought.find()
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },
  //create new thought
  createNewThought: async (req, res) => {
    try {
      const valid = await User.findOne({
        _id: req.body.userId,
      });
      if (valid) {
        const newThought = await Thought.create(req.body);
        await User.findOneAndUpdate(
          { _id: req.body.userId },
          { $addToSet: { thoughts: newThought._id } },
          { runValidators: true, new: true }
        );
        res.json(newThought);
      } else {
        res.status(404).json('No such user ID');
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  //get a single thought
  getSingleThought: (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
      .then((result) => res.json(result))
      .catch((err) => res.status(500).json(err));
  },

  //update a single thought
  updateSingleThought: async (req, res) => {
    try {
      const newThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      res.json(newThought);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //delete a thought
  delSingleThought: async (req, res) => {
    try {
      const result = await Thought.deleteOne({ _id: req.params.thoughtId });
      res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //create a new reaction
  createNewReaction: async (req, res) => {
    try {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //delete a reaction
  delSingleReaction: async (req, res) => {
    try {
      const result = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.body.reactionId } } },
        { runValidators: true, new: true }
      );
      if (result) {
        res.json(result);
      } else {
        res.json('No such reactionID');
      }
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
