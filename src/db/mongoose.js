const mongoose = require("mongoose");

const options = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
  dbName: "task-manager",
};

class Database {
  constructor() {
    this.__connect();
  }

  __connect() {
    mongoose
      .connect(process.env.MONGODB_URI, options)
      .then(() => console.log("Connected to database."))
      .catch(() => console.error("Error connecting to database."));
  }
}

module.exports = new Database();
