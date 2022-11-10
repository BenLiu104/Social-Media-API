const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

  // update a user
  async updateSingleUser(req, res) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { new: true }
      );
      res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //delete a user
  async delSingleUser(req, res) {
    try {
      const delUser = await User.findOneAndRemove({ _id: req.params.userId });
      if (delUser) {
        for (const thought of delUser.thoughts) {
          let result = await Thought.deleteOne({
            _id: thought._id,
          });
        }
        res.json(`User ${delUser.username} deleted`);
      } else {
        res.status(404).json('No such user ID');
      }
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //add a new friend
  async newFriend(req, res) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );
      console.log(result);
      res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  //delete a friend
  async delFriend(req, res) {
    try {
      const result = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true, runValidators: true }
      );
      console.log(result);
      res.json(result);
    } catch (error) {
      res.status(400).json(error);
    }
  },
};
