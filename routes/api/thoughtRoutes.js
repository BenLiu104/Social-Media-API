const router = require('express').Router();

const {
  getAllThought,
  createNewThought,
  getSingleThought,
  updateSingleThought,
  delSingleThought,
  createNewReaction,
  delSingleReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getAllThought).post(createNewThought);

router
  .route('/:thoughtId')
  .get(getSingleThought)
  .put(updateSingleThought)
  .delete(delSingleThought);

router
  .route('/:thoughtId/reactions')
  .post(createNewReaction)
  .delete(delSingleReaction);

module.exports = router;
