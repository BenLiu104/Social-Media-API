const router = require('express').Router();
const { Thought, User } = require('../../models');
// const {
//   getVideos,
//   getSingleVideo,
//   createVideo,
//   updateVideo,
//   deleteVideo,
//   addVideoResponse,
//   removeVideoResponse,
// } = require('../../controllers/thoughtController');

// /api/videos
// router.route('/').get(getVideos).post(createVideo);

// /api/videos/:videoId
// router
//   .route('/:videoId')
//   .get(getSingleVideo)
//   .put(updateVideo)
//   .delete(deleteVideo);

router.route('/').get((req, res) => {
  Thought.find()
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

router.route('/:thoughtId').get((req, res) => {
  Thought.findOne({ _id: req.params.thoughtId })
    .then((result) => res.json(result))
    .catch((err) => res.status(500).json(err));
});

router.route('/').post(async (req, res) => {
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
});

router.route('/:thoughtId').put(async (req, res) => {
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
});

router.route('/:thoughtId').delete(async (req, res) => {
  try {
    const result = await Thought.deleteOne({ _id: req.params.thoughtId });
    res.json(result);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.route('/:thoughtId/reactions').post(async (req, res) => {
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
});

router.route('/:thoughtId/reactions').delete(async (req, res) => {
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
});
// /api/videos/:videoId/responses
// router.route('/:videoId/responses').post(addVideoResponse);

// /api/videos/:videoId/responses/:responseId
// router.route('/:videoId/responses/:responseId').delete(removeVideoResponse);

module.exports = router;
