var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

//import .env module
const dotenv=require("dotenv");

//import routes
var indexRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var dealerRouter = require('./routes/dealer')
var authRouter = require("./routes/auth")


var app = express();

//configure .env
dotenv.config();

//for react server 
app.use(cors({ origin: 'http://localhost:5173' }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/dealer',dealerRouter);
app.use('/auth',authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(req.app.get('env') === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
