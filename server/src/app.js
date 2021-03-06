var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bp = require('body-parser');

var app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(bp.urlencoded({ extended: false }))
app.use(bp.json())

var indexRouter = require('./routes/index');
var oauthRouter = require('./routes/oauth');
var spotifyRouter = require('./routes/spotify');

const cors = process.env.CORS || '';
const corsList = cors.split(',');

app.use((req, res, next) => {
  let origin = null;
  const thisOrigin = req.get('origin');

  if (cors === 'all') {
    origin = thisOrigin;
  } else {
    const index = corsList.indexOf(thisOrigin);

    if (index >= 0) {
      origin = corsList[index];
    }
  }

  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, x-id, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', true);
  }

  next();
});

app.use('/', indexRouter);
app.use('/oauth', oauthRouter);
app.use('/spotify', spotifyRouter);

app.use(function(err, req, res, next) {
  if (err) {
    logger.error(err);
  }
  return res.status(500).end();
});

module.exports = app;
