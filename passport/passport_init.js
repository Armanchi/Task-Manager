const passport = require("passport");

const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

const bcrypt = require("bcryptjs");

const passport_init = () => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' },(email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect credentials." });
        }
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect credentials." });
          }
        });
        // return done(null, user);
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

module.exports = passport_init;