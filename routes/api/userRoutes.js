const User = require('../../models/User');
const Thought = require('../../models/Thought');
const { ObjectId } = require('mongoose').SchemaType;

const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
} = require('../../controllers/userController');
const { findOneAndUpdate } = require('../../models/User');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router.route('/:userId').get(getSingleUser);
// .put(updateSingleUser)
// .delete(delSingleUser);

router.route('/:userId').put(async (req, res) => {
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
});

router.route('/:userId').delete(async (req, res) => {
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
});

// router.route('/:userId/friends/:friendID').post(newFriend).delete(delFriend);
router.route('/:userId/friends/:friendId').post(async (req, res) => {
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
});

router.route('/:userId/friends/:friendId').delete(async (req, res) => {
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
});
module.exports = router;
