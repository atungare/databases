var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');

var sq = require('./sqlize.js');
sq.Message.sync();
sq.User.sync();
sq.Room.sync();






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
  console.log("Room is " + room);
  sq.Room.find({where:{room:room}})
    .success(function(rm){
      if (rm) {
        var rmId = rm.room_id;
        sq.Message.findAll({where:{room_id:rmId}}).success(function(msgs){
          res.send(JSON.stringify({messages: msgs}));
        });
      } else {
        res.send(JSON.stringify({messages: []}));
      }
    })
  ;




};

var handlePost = function(req, res){
  var room = req.params.room;
  var user = req.body['username'];
  var msg = req.body['message'];

  console.log(room, user, msg);

  var roomId;
  var userId;

  var getRoomIdThenProceed = function() {
    sq.Room.find({where:{room:room}})
      .success(function(rm) {
        if(rm) {
          roomId = rm.room_id;
          getUserIdThenProceed();
        } else {
          sq.Room.create({room:room})
            .success(function(rm) {
              roomId = rm.room_id;
              getUserIdThenProceed();
            });
        }
      });
  };

  var getUserIdThenProceed = function() {
    sq.User.find({where:{username:user}})
      .success(function(usr) {
        if (usr) {
          userId = usr.user_id;
          addMessageThenProceed();
        } else {
          sq.User.create({username:user})
            .success(function(usr) {
              userId = usr.user_id;
              addMessageThenProceed();
            });
        }
      });
  };

  var addMessageThenProceed = function(){
    sq.Message.create({message:msg, room_id:roomId, user_id:userId})
      .success(function() {
        res.send(JSON.stringify(req.body));
      })
    ;
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
