const { Thought, User } = require("../models");

module.exports = {
  // /api/thoughts
  //Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const dbThoughts = await Thought.find();
      return res.status(200).json(dbThoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //Get a single thought by its `id` parameter. Returns a JSON object of the thought data values.
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.id })
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.status(500).json(err));
  },
  //POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
  createThought(req, res) {
    Thought.create(req.body)
      .then((dbThought) => {
        return User.findOneAndUpdate(
          { username: req.body.username },
          { $push: { thoughts: dbThought._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          return res.status(404).json({
            message:
              "Thought created but no user with  that username was found.",
          });
        }
        res
          .status(200)
          .json({ message: "Thought created!", thought: dbUserData });
      })
      .catch((err) => res.status(400).json(err));
  },
  //PUT to update a thought by its _id
  updateThought(req, res) {
    Thought.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          return res
            .status(404)
            .json({ message: "No thought found with this id!" });
        }
        res.status(200).json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  //DELETE to remove a thoughts by its _id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });
      //find the user that owns the deleted thought and update their thoughts array
      //by removing the deleted thought's id from it
      if (!thought) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      // remove thought id from users thoughts field
      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } }, // this pulls out the value of req.params.thougtId in the user document where the array matches
        { new: true }
      );
      //send back the user's info without the deleted thought
      if (!user) {
        return res.status(404).json({
          message: "Thought created but no user with this id!",
        });
      }
      res.json({ message: "Thought has been removed!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // /api/thoughts/:thoughtId/reactions
  //POST to create a reaction stored in a single thought's reactions array field
  addReaction({ params, body }, res) {
    console.log("reaction", params, body);
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $addToSet: { reactions: body } },
      { runValidators: true, new: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No thought found with this id" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  //DELETE to pull and remove a reaction by the reaction's reactionId value
  //This will then reduce the count of the number of reactions by -1
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { new: true }
      );
      //if  no thought is found, send back a 404
      if (!thought) {
        return res.status(404).json({ message: "No thought with this id." });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.sendStatus(500).json(err);
    }
  },
};
