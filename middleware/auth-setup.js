const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getCollection } = require('../config/db');
const { ObjectId } = require('mongodb');

function configurePassport() {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const collection = getCollection('adopters');
      let user = await collection.findOne({ googleId: profile.id });
      if (!user) {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          emails: profile.emails || [],
          provider: 'google'
        };
        const result = await collection.insertOne(newUser);
        user = await collection.findOne({ _id: result.insertedId });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user, done) => {
    done(null, String(user._id));
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const collection = getCollection('adopters');
      const user = await collection.findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  return passport;
}

module.exports = configurePassport;
