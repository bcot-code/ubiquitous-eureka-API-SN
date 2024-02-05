const { Schema, model, Types } = require("mongoose");
const dateFormat = (date) => {
  return date.toISOString().slice(0, 10);
};
// Schema to create Reaction
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    //reaction needs to have a user, the type of reaction (upvote or downvote), and the post it is on.
    username: { type: String, required: true },

    createdAt: {
      type: Date,
      default: Date.now,
      //Use a getter method to format the timestamp on query
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);
// Schema to create Thought model
const thoughtSchema = new Schema(
  {
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
      get: (createdAtVal) => dateFormat(createdAtVal),
    },
    username: {
      type: String,
      ref: "User",
    },
    // Array to hold references to associated reactions
    reactions: {
      type: [reactionSchema],
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);
//Create a virtual called reactionCount that retrieves the length of the thought's reactions array field on query.
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

//Initialize our Thought model
const Thought = model("Thought", thoughtSchema);

module.exports = Thought;
