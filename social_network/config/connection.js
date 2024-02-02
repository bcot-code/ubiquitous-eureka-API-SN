const { connect, connection } = require("mongoose");

const connectionUrl = "mongodb://127.0.0.1:27017/eurekaApi";
connect(connectionUrl);
module.exports = connection;
