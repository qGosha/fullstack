const passport = require('passport');

const loggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send('you are not logged in');
    }
}

module.exports = (app) => {

  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

  app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email'] }));

  app.get('/auth/facebook/callback',
  passport.authenticate('facebook'), (req, res) => {
    res.redirect('/current_user');
  });


  app.post('/login', (req, res, next) => {
    if(req.user) return res.redirect('/dashboard');
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: info.message }) }
      req.login(user, loginErr => {
        if (loginErr) {
          return next(loginErr);
        }
        return res.send({ success : true, message : req.user });
      });
    })(req, res, next);
  });

  app.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
    if(req.user) {
      res.redirect('/api/current_user');
    }
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
     req.session.destroy();
    res.send(`You successfuly logged out!`)
  });
  app.get('/api/current_user',
   (req, res) => {
    res.send(req.user);
  });

}
