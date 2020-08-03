const passport = require('passport');
const chalk = require('chalk');
let user = {};
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(new GoogleStrategy({
  clientID: process.env.googleUserID,
  clientSecret: process.env.googleKey,
  callbackURL: process.env.googleCallBackURL,
        }, (accessToken, refreshToken, profile, done) => {
         user = {...profile};
         return done(null, profile);
}));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
