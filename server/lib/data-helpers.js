"use strict";

// Simulates the kind of delay we see with network or filesystem operations
// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, ObjectId) {
  return {

    // Saves a tweet to `Mongo db`
    saveTweet: function(newTweet, callback) {

        db.collection("tweets").insertOne(newTweet, (err, result) => {
        if(err) {
          callback(err);
        }
        callback(null, true);
      });
    },

    // Get tweets from Mongo DB
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if(err) {
          callback(err);
        }
        callback(null, tweets);
      });
    },

    likeIt: function(tweetid, callback) {
      db.collection("tweets").findOne({_id: ObjectId(tweetid)}, (err, tweet) => {
        if(err) {
          callback(err);
        }
        console.log('tweet', tweet);
        db.collection("tweets").update(
          {_id: ObjectId(tweetid)}, {$set: {like: !tweet.like}}, (err, result) => {
            if(err) {
              callback(err);
            }
            callback(null, result);
          })
    })
    },

    getLike: function(callback) {
      db.collection("tweets").find().toArray((err, tweets) => {
        if(err) {
          callback(err);
        }
        callback(null, tweets);
      });
    },

}
}

