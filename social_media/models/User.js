const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trimmed,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: () => Promise.resolve(false),
      message: "Email validation failed",
    },
  },
  thoughts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thought",
    },
  ],
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

//Create a virtual called friendCount that retrieves the length of the user's friends array field on query.
userSchema.virtual("friendCount").get(function() {
  return this.friends.length;
});

const User = mongoose.model("User", userSchema);
module.exports = User;
