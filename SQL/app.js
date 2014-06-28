var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');
var db = require('./db').dbConnection;
db.connect(function(err){});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

var defaultHeaders = function(res) {
  res.set("access-control-allow-origin", "*");
  res.set("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.set("access-control-allow-headers", "content-type, accept");
  res.set("access-control-max-age", 10);
  res.set('Content-Type', 'text/plain');
};

var handleGet = function(req, res) {
  var room = req.params.room;
  db.query("SELECT messages.message, users.username, rooms.room FROM messages, users, rooms WHERE messages.user_id = users.user_id AND messages.room_id = rooms.room_id", [], function(err, dbArr) {
    res.send(JSON.stringify({messages: dbArr}));
  });
};

var handlePost = function(req, res){
  var reqData = JSON.parse(Object.keys(req.body)); // BodyParser parses the string into an object

  var room = req.params.room;
  var user = reqData['username'];
  var msg = reqData['message'];

  var roomId;
  var userId;

  var getRoomIdThenProceed = function() {
    db.query("SELECT room_id from rooms WHERE room = ?", room, function(err, result) {
      if(result && result.length) {
        roomId = result[0]['room_id'];
        getUserIdThenProceed();
      } else {
        db.query("INSERT INTO rooms (room) values (?)", room, function (err, result) {
          roomId = result['insertId'];
          getUserIdThenProceed();
        });
      }
    });
  };

  var getUserIdThenProceed = function() {
    db.query("SELECT user_id from users WHERE user = ?", user, function(err, result) {
      if(result && result.length) {
        userId = result[0]['user_id'];
        addMessageThenProceed();
      } else {
        db.query("INSERT INTO users (username) values (?)", user, function (err, result) {
          userId = result['insertId'];
          addMessageThenProceed();
        });
      }
    });
  };

  var addMessageThenProceed = function(){
    db.query("INSERT INTO messages (message, room_id, user_id) values (?, ?, ?)", [msg, roomId, userId], function(err, result) {
      res.send(JSON.stringify(reqData));
    });
  };

  getRoomIdThenProceed();
};

app.all('*', function(req, res, next) {
  defaultHeaders(res);
  if(req.method === 'OPTIONS') {
    res.set('Content-Type', 'application/json');
    res.send(200);
  } else {
    next();
  }
});

app.get('/classes/:room', handleGet);
app.post('/classes/:room', handlePost);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
