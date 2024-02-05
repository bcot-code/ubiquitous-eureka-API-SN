const { User, Thought } = require("../models");

module.exports = {
  // /api/users
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find()
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          selec: "-__v",
        })
        .select("-__v")
        .sort({ _id: -1 });
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get single user by id and populated thought and friend data
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).populate([
        {
          path: "thoughts",
          select: "-__v",
        },
        {
          path: "friends",
          select: "-__v",
        },
      ]);
      if (!user) {
        return res.status(404).json({ message: "No user with that ID!" });
      }
      res.json({
        user: user,
        totalThoughts: user.thoughts.length,
        friends: user.friends.length,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // POST create a new user
  async createUser({ body }, res) {
    try {
      const user = await User.create(body);
      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
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
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) => {
        if (!user) {
          res.json({ removed: req.params.userId });
        }
        //BONUS: Remove a user's associated thoughts when deleted.
        return Thought.deleteMany({ _id: { $in: user.thoughts } });
      })
      .then(() =>
        res.json({ message: "User and their thoughts have been deleted." })
      )
      .catch((err) => res.status(500).json(err));
  },
  // /api/users/:userId/friends/:friendId
  //POST to add a new friend to the users friend list
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true, runValidators: true }
    )
      .then((users) => {
        if (!users) {
          return res
            .status(404)
            .json({ message: "No user found with this id!" });
        }
        res.json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  //DELETE to remove a friend from the user's friend list
  removeFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((users) => {
        if (!users.friends.length) {
          users.friends = [];
        }
        res.json(users);
      })
      .catch((err) => res.status(500).json(err));
  },
};
