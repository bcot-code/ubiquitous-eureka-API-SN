const { Schema, model } = require("mongoose");

// Schema to create Thought model
const thoughtSchema = new Schema({
  thoughtText: {
    type: String,
    required: "You must think of something!",
    minlength: 1,
    maxlength: 280,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
    //Use a getter method to format the timestamp on query
    get: (createdAtVal) =>
      createdAtVal.toDateString() +
      " " +
      createdAtVal.toTimeString().split("GMT")[0] +
      " UTC",
  },
  username: {
    type: String,
    ref: "User",
  },
  // Array to hold references to associated reactions
  reactions: {
    type: [reactionSchema],
    default: [],
  },
});
//Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Create a method on the Thought model called `addReaction` that will add
// a reaction to a thought by pushing the passed data in as an object into the reactions array
thoughtSchema.methods.addReaction = function (reaction) {
  this.reactions.push(reaction);
  return this.save();
};
//Initialize our Thought model
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
