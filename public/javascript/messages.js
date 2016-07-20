$(document).ready(function() {

  var socket = io();
  socket.emit('add user', { userFrom: user });

  $(".list-group-item:nth-child(2)").addClass("active");


  //////////////////////////
  var userToID = $('.list-group-item.active').attr("id").split("-")[1];
  var userFromID = user.id;
  var roomName;
  // NOTE: The room names are always sorted from smaller number to higher number
  // NOTE: Room names are the same even if reversed
  if (userFromID < userToID) {
    roomName = 'user' + userFromID + '-'+ 'user' + userToID;
  } else {
    roomName = 'user' + userToID + '-'+ 'user' + userFromID;
  }
  socket.emit('get messages', { userFrom: user, userToID: userToID, userFromID: userFromID, roomName: roomName });

  /////////////////////


  $("div.list-group a").click(function(e) {
    e.preventDefault();
    //
    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");

    var userToID = $(this).attr("id").split("-")[1];
    var userFromID = user.id;
    var roomName;
    // NOTE: The room names are always sorted from smaller number to higher number
    // NOTE: Room names are the same even if reversed
    if (userFromID < userToID) {
      roomName = 'user' + userFromID + '-'+ 'user' + userToID;
    } else {
      roomName = 'user' + userToID + '-'+ 'user' + userFromID;
    }
    socket.emit('get messages', { userFrom: user, userToID: userToID, userFromID: userFromID, roomName: roomName });

    console.log("Getting messages from room name: " + roomName);
  });

  /* Socket IO Client */

  $('form').submit(function() {
    var msg = $('#m').val();
    var userToID = $('.list-group-item.active').attr("id").split("-")[1];
    var userFromID = user.id;
    var roomName;
    // NOTE: The room names are always sorted from smaller number to higher number
    // NOTE: Room names are the same even if reversed
    if (userFromID < userToID) {
      roomName = 'user' + userFromID + '-'+ 'user' + userToID;
    } else {
      roomName = 'user' + userToID + '-'+ 'user' + userFromID;
    }

    socket.emit('private message', { userFrom: user, userFromID: user.id, userToID: userToID, msg: msg, roomName: roomName });
    $('#m').val('');

    return false;
  });

  socket.on('private message', function(data){
    console.log(data);
    console.log("Sender name:");
    console.log(data.userFrom.username);
    $('#messages').append('<span class="">' + data.userFrom.username + ':</span><li>' + data.msg + '</li><br>');
  });

  socket.on('bulk get message', function(data) {
    var arr_of_messages = data.bulk_messages;
    $('#messages').empty();

    for (var i=0; i < arr_of_messages.length; i++) {
      message = arr_of_messages[i];
      var userToUsername = $('.list-group-item.active h5').html();

      if (message.user_from === user.id) {
        $('#messages').append('<span class="">' + data.userFrom.username + ':</span><li>' + message.message + '</li><br>');
      } else {
        $('#messages').append('<span class="">' + userToUsername + ':</span><li>' + message.message + '</li><br>');
      }
    }
  });

  /* -------------- */

});
