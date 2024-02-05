const { connect, connection } = require("mongoose");

const connectionUrl = "mongodb://127.0.0.1:27017/socialmediaApi";
connect(connectionUrl);
module.exports = connection;
