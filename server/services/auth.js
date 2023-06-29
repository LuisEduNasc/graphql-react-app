const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = mongoose.model('user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() })
      .then(user => {
        if (!user) {
          return done(null, false, 'Invalid Credentials');
        }
        return user.comparePassword(password)
          .then(isMatch => {
            if (isMatch) {
              return done(null, user);
            }
            return done(null, false, 'Invalid credentials.');
          });
      })
      .catch(err => done(err));
  })
);

function signup({ email, password, req }) {
  const user = new User({ email, password });
  if (!email || !password) {
    throw new Error('You must provide an email and password.');
  }

  return User.findOne({ email })
    .then(existingUser => {
      if (existingUser) {
        throw new Error('Email in use');
      }
      return user.save();
    })
    .then(user => {
      return new Promise((resolve, reject) => {
        req.login(user, err => {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      });
    });
}

async function login({ email, password, req }) {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new Error('Invalid credentials.');
    }

    return new Promise((resolve, reject) => {
      user.comparePassword(password, async (err, isMatch) => {
        if (err) {
          console.error(err);
          reject(new Error('An error occurred during password comparison.'));
        } else {
          if (isMatch) {
            try {
              await new Promise((innerResolve, innerReject) => {
                req.login(user, err => {
                  if (err) {
                    innerReject(err);
                  } else {
                    innerResolve();
                  }
                });
              });
              resolve(user);
            } catch (loginError) {
              reject(new Error('An error occurred during user login.'));
            }
          } else {
            reject(new Error('Invalid credentials.'));
          }
        }
      });
    });
  } catch (error) {
    throw new Error(error.message);
  }
}


module.exports = { signup, login };
