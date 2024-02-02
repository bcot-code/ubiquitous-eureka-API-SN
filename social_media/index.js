const express = require("express");
const db = require("./config/connection");
const routes = require("./routes");
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server is running on port ${PORT}!`);
    // log where we are now
  });
});
