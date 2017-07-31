const express = require('express');
const path = require('path');
const debug = require('debug')('admin:app');

//Session and redis configs
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const flashSession = require('connect-flash');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const validator = require('express-validator');
const helmet = require('helmet');
const csurf = require('csurf');
const logger = require('morgan');

const hbs = require('./core/hbs');
const config = require('./config');
const db = require('./db');

var app = express();
hbs.registerPartials(path.join(__dirname, 'views/layouts'));
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: 'layouts/layout' });
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser(config.app_secret));
app.use(csurf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));

var session_options = {
  cookie: {},
  resave: false,
  secret: config.app_secret,
  store: new redisStore({
    host: config.redis.host,
    port: config.redis.port,
    client: redis.createClient(),
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

//get number of articles
let Blog = require('./models/blog');
Blog.find({deleted: false})
.then((result) => {
    app.locals.blogsCount = result.length;
    debug('Number of articles retrieved ' + app.locals.blogsCount);
});

//Routes
let login = require('./controllers/login');
let blogs = require('./controllers/blogs');
let dashboard = require('./controllers/dashboard');
let categories = require('./controllers/categories');
let resetpassword = require('./controllers/resetpassword');

app.use('/', login.router, resetpassword);
app.use('/sudo', login.check_logged_in);
app.use('/sudo', dashboard, categories, blogs);

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
  res.render('error', {layout: false});
});

module.exports = app;
