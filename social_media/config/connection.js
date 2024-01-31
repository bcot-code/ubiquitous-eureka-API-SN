const { connect, connection } = require("mongoose");

const connectionUrl = "mongodb://127.0.0.1:27017";
connect(connectionUrl);
module.exports = connection;
