
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , passport = require('passport')
  , FacebookStrategy = require('passport-facebook')
  , collectionName = 'parties'
  , dbURL = 'mongodb://localhost/' + collectionName;

var app = express();

passport.use(new FacebookStrategy({
  clientID: '385825361558248',
  clientSecret: '4c9c35288af7b8d257fc53f7660e78fd',
  callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  FacebookUser.findOne({fbId: profile.id}, function(err, oldUser) {
    if (oldUser) {
      done(null, oldUser);
    } else {
      var newUser = new FacebookUser({
        fbId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName
      }).save(function(err, newUser) {
        if (err) {
          throw err;
        }
        done(null, newUser);
      });
    }
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  FacebookUser.findById(id, function(err, user) {
    if (err) {
      done(err);
    }
    if (user) {
      done(null, user);
    } else {
      // ???
    }
  });
});

function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

// Connecting to MongoDB
mongoose.connect(dbURL);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.engine('html', require('hbs').__express);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'SECRET'}));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

require(__dirname + '/routes')(app, server)