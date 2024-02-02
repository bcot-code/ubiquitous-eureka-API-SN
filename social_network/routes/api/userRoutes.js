const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../controllers/users_controller");

// /api/users
router.route("/").get(getUsers).post(createUser);
// /api/users/:userId
router.route("/:userId").get(getSingleUser).delete(deleteUser).put(updateUser);
//add friend to user's friends list
router
  .route("/:userId/friends/:friendId")
  .post(addFriend)
  //remove a friend from the users friend list
  .delete(removeFriend);

module.exports = router;
