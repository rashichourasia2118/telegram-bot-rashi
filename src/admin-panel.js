const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();
const users = [];

passport.use(new GoogleStrategy({
  clientID: 'YOUR_GOOGLE_CLIENT_ID',
  clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
  callbackURL: 'http://localhost:5500/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
 
  let user = users.find(u => u.id === profile.id);
  if (!user) {
    user = {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
      subscriptions: []
    };
    users.push(user);
  }
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

app.use(session({ secret: 'your_secret_key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/admin');
  }
);

app.get('/admin', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  const user = req.user;
  res.send(`Admin Panel - Welcome, ${user.displayName} (${user.email})`);
});

app.get('/subscriptions', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.send('Unauthorized');
  }
  const user = req.user;
  const subscriptions = user.subscriptions;
  if (subscriptions.length > 0) {
    res.send(`Subscribed to weather updates for: ${subscriptions.join(', ')}`);
  } else {
    res.send('Not subscribed to any cities.');
  }
});

module.exports = app;
