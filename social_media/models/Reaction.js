const Schema = require("mongoose");

const reactionSchema = new Schema({
  reactionId: {
    type: Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  },
  //reaction needs to have a user, the type of reaction (upvote or downvote), and the post it is on.
  username: { type: String, required: true },

  createdAt: {
    type: Date,
    default: Date.now,
    //Use a getter method to format the timestamp on query
    get: (createdAtVal) => moment(createdAtVal).format("MMM DD, Y @ hh:mm A"),
  },
});

//This will not be a model, but rather will be used as the reaction field's subdocument schema in the Thought model.
//This will add methods to the schema that can be used in our reactions model
reactionSchema.query.findByUsername = function (username) {
  return this.model("Reaction").find({ username: username });
};

module.exports = Reaction = mongoose.model("Reaction", reactionSchema);
