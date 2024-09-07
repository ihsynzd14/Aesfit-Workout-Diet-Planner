const passport = require('passport');
const User = require('../models/user');

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// If you need custom behavior, you can still define a custom strategy:
/*
passport.use(new LocalStrategy({ usernameField: 'email' },
  async (email, password, done) => {
    try {
      const { user, error } = await User.authenticate()(email, password);
      if (error) return done(null, false, { message: 'Invalid credentials' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));
*/