const expressSession = require("express-session");
const mongoDbStore = require("connect-mongodb-session");
// const mongoose = require('mongoose');

function createSessionStore() {
  const MongoDbStore = mongoDbStore(expressSession);
  let sessionUrl = "mongodb://127.0.0.1:27017";

  if (process.env.MONGODB_URL) {
    sessionUrl = process.env.MONGODB_URL;
  }

  store = new MongoDbStore({
    uri: sessionUrl,
    databaseName: "online-shop",
    collection: "sessions",
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: "super-secret",
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = createSessionConfig;
