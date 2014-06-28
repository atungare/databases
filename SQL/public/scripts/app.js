// YOUR CODE HERE:

/*

$.ajax({
  url: "a string",
  type: "GET", "POST", "PUT", "DELETE",
  dataType: "html", "json", "jsonp" (default to intelligent guess),
  data: Object (will be stringified)
  success: Function,
  error: Function,
  complete: Function
})

 */

var response;
var roomNames = [];

var app = {};

app.server = "http://127.0.0.1:8080/classes/messages";
app.currentUser = window.location.search.split('=')[1];
app.currentRoom = null;

$(function(){
  var roomListTemplate = Handlebars.compile($("#room-list").html());
  var messageListTemplate = Handlebars.compile($("#message-list").html());

  app.init = function() {
    $("body").on("click", ".username", function(evt){
      app.addFriend( $(this).html() );
    });

    $("#send").on("click", ".submit", function(){
      app.handleSubmit($(".message").val());
      $(".message").val("");
    });

    $(".message").keydown( function( evt ) {
      if ( evt.which === 13 ) {
        $("#send .submit").click();
      }
    });

    setInterval( function(){
      app.fetch().then( function(json){
        console.log(json);
        json = JSON.parse(json);
        app.addAllMessages(json.messages);
        // _.each(json.results, function(element) {
        //   roomNames.push(element["roomname"]);
        // });
        // roomNames = _.uniq(roomNames);
        // console.log(roomNames);
        // app.addAllRooms(roomNames);
      });
    }, 1000);
  };

  app.send = function(data){
    return $.ajax({
      url: this.server,
      type: "POST",
      data: data,
      success: function(){
        console.log("Ajax FTW");
      }
    });
  };

  app.fetch = function() {
    return $.ajax({
      url: this.server,
      type: "GET"
    });
  };

  app.addAllMessages = function(messages){
    $(".message-list").children().detach();
    if (!!messages && messages.length) {
      $(".message-list").append(messageListTemplate({messages: messages}));
    }
  };

  app.clearMessages = function(){
    $("#chats").empty();
  };

  app.addAllRooms = function(roomNames) {
    console.log(roomListTemplate(roomNames));
    $(".rooms-list").append(roomListTemplate(roomNames));
  };

  app.addFriend = function(username) {

  };

  app.handleSubmit = function(message) {
    return app.send({
      message: message,
      username: app.currentUser || "John Doe",
    });
  };

  app.init();
});

