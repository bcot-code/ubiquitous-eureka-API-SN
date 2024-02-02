const { User } = require("../models/User");

module.exports = {
  // get all users
  getUsers(req, res) {
    User.find()
      .then((users) => {
        if (!users || users.length === 0) {
          return res.status(404).json({ message: "No users found" });
        }
        res.json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send();
      });
  },
  // get single uer by id and populated thought and friend data
  getSingleUser(req, res) {
    User.findOne({ username: req.params.username })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: "No user with that username!" });
        }
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // POST create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // PUT to update a user by id and populated thought and friend data
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json({ message: "User updated!" });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // DELETE to remove user by id
  deleteUser(req, res) {
    User.remove({ _id: req.params.userId })
      .then(() => {
        res.json({ removed: req.params.userId });
      })
      .catch((err) => res.status(500).json(err));
  },
};
//BONUS: Remove a user's associated thoughts when deleted.
Thought.deleteMany({ username: req.params.username })
  .exec()
  .then(() => res.jsons({ message: "Thoughts have been cleared!" }));

/*api/users/:userId/friends/:friendId */
//POST to add a new friend to the users friend list
//DELETE to remove a friend from the user's friend list
