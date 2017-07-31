var express = require('express');
var debug = require('debug')('admin:article_service')
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var helmet = require('helmet');
var csurf = require('csurf');

var config = require('./config');
var db = require('./db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(helmet({frameguard: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser(config.app_secret));
app.use(express.static(path.join(__dirname, 'public')));

var session = require('express-session');
var redisStore = require('connect-redis')(session);
var flashSession = require('connect-flash');
var session_options = {
  cookie: {},
  resave: false,
  secret: config.app_secret,
  store: new redisStore({
    host: config.redis.host,
    port: config.redis.port,
    client: require('redis').createClient(),
    ttl: 600 //session should expire in 1m
  }),
  saveUninitialized: false
};

debug(`app environment is ${app.get('env')}`);
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  session_options.cookie.secure = true // serve secure cookies
}

app.use(session(session_options));
app.use(flashSession());
app.use(function(req, res, next) {
  if(req.session.user && req.session.logged_in) next();        
  else{
    res.send(`
      <script>
        window.top.location.href = '${config.services.main_host}/logout';
      </script>`
    );
  }
});

var blog = require('./controllers/blogs');
var uploader = require('./controllers/awsuploader');

app.use('/', uploader);
app.use('/blogs', csurf({ cookie: true }), blog);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
