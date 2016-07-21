$(document).ready(function() {

  var socket = io();
  socket.emit('add user', { userFrom: user });

  $(".list-group-item:nth-child(3)").addClass("active");

  //////////////////////////
  var userToID = $('.list-group-item.active').attr("id").split("-")[1];
  var userFromID = user.id;
  var readyToReceiveFrom = userToID;
  var roomName;
  // NOTE: The room names are always sorted from smaller number to higher number
  // NOTE: Room names are the same even if reversed
  if (userFromID < userToID) {
    roomName = 'user' + userFromID + '-'+ 'user' + userToID;
  } else {
    roomName = 'user' + userToID + '-'+ 'user' + userFromID;
  }
  socket.emit('get messages', { userFrom: user, userToID: userToID, userFromID: userFromID, roomName: roomName, readyToReceiveFrom: readyToReceiveFrom });

  /////////////////////


  $("div.list-group a").click(function(e) {
    e.preventDefault();
    //
    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");

    var userToID = $(this).attr("id").split("-")[1];
    var userFromID = user.id;
    var readyToReceiveFrom = userToID;
    var roomName;
    // NOTE: The room names are always sorted from smaller number to higher number
    // NOTE: Room names are the same even if reversed
    if (userFromID < userToID) {
      roomName = 'user' + userFromID + '-'+ 'user' + userToID;
    } else {
      roomName = 'user' + userToID + '-'+ 'user' + userFromID;
    }
    socket.emit('get messages', { userFrom: user, userToID: userToID, userFromID: userFromID, roomName: roomName, readyToReceiveFrom: readyToReceiveFrom });

    $('#messages-list').scrollTop($("#messages-list")[0].scrollHeight);
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
    $('#messages').append('<div class="user_from col-md-12"><img class="col-md-1" src=' + data.userFrom.profile_picture + ' /><div class="col-md-11"><span class="user_from">' + data.userFrom.username + ':</span><li>' + data.msg + '</li></div></div><br>');

    $('#messages-list').scrollTop($("#messages-list")[0].scrollHeight);
  });

  socket.on('bulk get message', function(data) {
    var arr_of_messages = data.bulk_messages;
    $('#messages').empty();



    var dateNow = new Date();
    var dateYesterday = new Date();
    dateYesterday.setDate(dateNow.getDate() - 1);
    console.log("dateNow");
    console.log(dateNow);
    console.log("dateYesterday");
    console.log(dateYesterday);


    var appendTodayToFirstMessage = 0;

    for (var i=0; i < arr_of_messages.length; i++) {
      message = arr_of_messages[i];
      var userToUsername = $('.list-group-item.active h5').html();

      var dateOfMessage = retrieveDate(message.created_at);
      var messageSentToday = dateOfMessage === dateNow.toDateString();



      if (messageSentToday && appendTodayToFirstMessage === 0) {
        console.log('message was sent today');
        console.log(message.message);

        if (message.user_from === user.id) {
          $('#messages').append('<div class="date-of-message col-md-12"><span class="date-of-message">Today</span></div>');
          $('#messages').append('<div class="user_from col-md-12"><img class="col-md-1" src=' + data.userFrom.profile_picture + ' /><div class="col-md-9"><span class="user_from">' + data.userFrom.username + ':</span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
        } else {
          $('#messages').append('<div class="user_to col-md-12"><img class="col-md-1" src=' + data.userTo.profile_picture + ' /><div class="col-md-9"><span class="user_to">' + data.userTo.username + ':</span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
        }

        appendTodayToFirstMessage++;
      } else {
        if (message.user_from === user.id) {
          $('#messages').append('<div class="user_from col-md-12"><img class="col-md-1" src=' + data.userFrom.profile_picture + ' /><div class="col-md-9"><span class="user_from">' + data.userFrom.username + ':</span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
        } else {
          $('#messages').append('<div class="user_to col-md-12"><img class="col-md-1" src=' + data.userTo.profile_picture + ' /><div class="col-md-9"><span class="user_to">' + data.userTo.username + ':</span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
        }
      }






    }

    $('#messages-list').scrollTop($("#messages-list")[0].scrollHeight);
  });

  /* -------------- */

});

function checkDate() {
  dateNow = new Date();


}

function retrieveDate(date) {
  date = date.split('T')[0];
  date = new Date(date);

  return date.toDateString();
}

function retrieveTime(date) {
  time = date.split('T')[1].split('.')[0].slice(0, -3);

  return time.toString();
}
