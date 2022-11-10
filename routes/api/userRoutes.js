const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateSingleUser,
  delSingleUser,
  newFriend,
  delFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:userId
router
  .route('/:userId')
  .get(getSingleUser)
  .put(updateSingleUser)
  .delete(delSingleUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(newFriend).delete(delFriend);

module.exports = router;
