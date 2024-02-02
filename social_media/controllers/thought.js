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
  async getSingleThought(req, res) {
    try {
      const dbThoughtData = await Thought.findOne({ _id: req.params.id }, -__v);
      if (!dbThoughtData)
        return res.status(404).json({ message: "No thought with this id!" });
      return res.status(200).json(dbThoughtData);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //POST to create a new thought (don't forget to push the created thought's _id to the associated user's thoughts array field)
  async createThought(req, res) {
    try {
      const createdThought = await Thought.create(req.body);
      await User.findOneAndUpdate(
        { username: req.body.userId },
        { $push: { thoughts: createdThought._id } },
        { new: true }
      );
      return res.status(404).json(createdThought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //PUT to update a thought by its _id
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      //if thought is not found, send back 404 error
      if (!updatedThought) {
        return res.status(404).json({ message: "No thought with this id! 🤔" });
      }
      // otherwise , find and update record, then return updated thought
      res.json(updatedThought);
    } catch (err) {
      console.log(err);
      res.send("Error updating thought");
    }
  },
  //DELETE to remove a thought by its _id
  async deleteThought(req, res) {
    try {
      const thoughtDeleted = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });
      //find the user  that owns the deleted thought and update their thoughts array
      //by removing the deleted thought's id from it
      if (!thoughtDeleted) {
        return res.status(404).json({ message: "No thought with this id!" });
      }
      // remove thought id from users thoughts field
      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoguths: req.params.thoughtId } }, // this pulls out the value of req.params.thougtId in the user document where the array matches
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
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        {
          $addToSet: { reaction: req.body },
        },
        { runValidators: true, new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ messgage: "No thought affiliated with this id" });
      }
      res.json(thought);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  //DELETE to pull and remove a reaction by the reaction's reactionId value
  //This will then reduce the count of the number of reactions by -1
  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reaction: { reactionId: req.params.reactionId } } },
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
