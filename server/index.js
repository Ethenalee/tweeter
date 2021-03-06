"use strict";

// Basic express setup:

const PORT          = 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const cookieSession = require('cookie-session')


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  cookieSession({
    name: 'session',
    keys: ['okdoky'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

// The in-memory database of tweets. It's a basic object with an array in it.
const {MongoClient, ObjectId} = require("mongodb");
const MONGODB_URI = "mongodb://localhost:27017/tweeter";


MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }

  // We have a connection to the "tweeter" db, starting here.
  console.log(`Connected to mongodb: ${MONGODB_URI}`);


// The `data-helpers` module provides an interface to the database of tweets.
// This simple interface layer has a big benefit: we could switch out the
// actual database it uses and see little to no changes elsewhere in the code
// (hint hint).
//
// Because it exports a function that expects the `db` as a parameter, we can
// require it and pass the `db` parameter immediately:
const DataHelpers = require("./lib/data-helpers.js")(db, ObjectId);

// The `tweets-routes` module works similarly: we pass it the `DataHelpers` object
// so it can define routes that use it to interact with the data layer.
const tweetsRoutes = require("./routes/tweets")(DataHelpers);

// Mount the tweets routes at the "/tweets" path prefix:
app.use("/tweets", tweetsRoutes);


// The code below here is to make sure that we close the conncetion to mongo when this node process terminates
function gracefulShutdown() {
  console.log("\nShutting down gracefully...");
  try {
    db.close();
  }
  catch (err) {
    throw err;
  }
  finally {
    console.log("I'll be back.");
    process.exit();
  }
}

process.on('SIGTERM', gracefulShutdown); // listen for TERM signal .e.g. kill
process.on('SIGINT', gracefulShutdown);  // listen for INT signal e.g. Ctrl-C
})

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
