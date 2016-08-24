$(document).ready(function() {
  if(user.organisation_or_user){
    $("#home").attr("href", '/organisation/dashboard');
    $(".settings").attr("href", '/organisation/settings');
    $(".logout").attr("href", '/organisation/logout');
  }
  else{

    $("#home").attr("href", '/user/dashboard');
    $(".settings").attr("href", '/user/settings' );
    $(".logout").attr("href", '/user/logout');
  }
  var socket = io();
  socket.emit('add user', { userFrom: user });
  console.log($(".list-group-item")[0]);
  $($(".list-group-item")[0]).addClass("active");

  //////////////////////////
  var userToID;
  try{
    userToID = $('.list-group-item.active').attr("id").split("-")[1];
  } catch(e){
    console.log(e);
  }
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

  $('#nowspan').click(function(){
    $('.arrow_box').show();
  });
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

  $('form').submit(function(e) {
    e.preventDefault();
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
    if(msg !== ''){
      socket.emit('private message', { userFrom: user, userFromID: user.id, userToID: userToID, msg: msg, roomName: roomName });
      $('#m').val('');
      $('.read_col').remove();
      return false;
    }

  });

  socket.on('private message', function(data){
    var userActiveID = $('.list-group-item.active').attr("id").split("-")[1];
    if(data.userToID == userActiveID || data.userFromID == userActiveID){
        $('#messages').append('<div class="user_from col-md-12"><img class="col-md-1" src=' + data.userFrom.profile_picture + ' /><div class="col-md-11"><span class="user_from">' + data.userFrom.username + ':</span><li>' + data.msg + '</li></div></div><br>');
    }

    console.log(data);
    if(data.read_by_recipient && data.userFromID == user.id){
      console.log("READ");
      $('#messages').append('<div class="read_col user_to col-md-12"><div class="col-md-9"><p class="read"><i class="fa fa-check" aria-hidden="true"></i> Read </p> </div></div>')
    }
    else{
      $('.read_col').remove();
    }
    $('#messages-list').scrollTop($("#messages-list")[0].scrollHeight);
  });

  socket.on('bulk get message', function(data) {
    console.log(data);
    var arr_of_messages = data.bulk_messages;
    $('#messages').empty();
    var dateNow = new Date();
    var dateYesterday = new Date();
    var dateLastWeek = new Date();
    var dateLastYear = new Date();
    dateYesterday.setDate(dateNow.getDate() - 1);
    dateLastWeek.setDate(dateNow.getDate() - 7);
    dateLastYear.setFullYear(dateLastYear.getFullYear() - 1);
    console.log(dateLastYear);
    var appendTodayToFirstMessage = 0;
    var appendYesterdayToFirstMessage = 0;
    var appendLastWeekFirstMessage = 0;
    var appendLastYearFirstMessage = 0;
    var appendLongAgoFirstMessage = 0;
    var userActiveID = $('.list-group-item.active').attr("id").split("-")[1];
    if(data.userToID == userActiveID || data.userFromID == userActiveID){
      for (var i=0; i < arr_of_messages.length; i++) {
        message = arr_of_messages[i];
        var userToUsername = $('.list-group-item.active h5').html();

        var dateOfMessage = retrieveDate(message.created_at);
        var messageSentToday = dateOfMessage === dateNow.toDateString();
        var messageSentYesterday = dateOfMessage === dateYesterday.toDateString();
        var messageSentLastWeek = Date.parse(dateOfMessage)  >= Date.parse(dateLastWeek) && !messageSentYesterday && !messageSentToday;
        var messageSentLastYear =  Date.parse(dateLastWeek) > Date.parse(dateOfMessage) && Date.parse(dateOfMessage) > Date.parse(dateLastYear) ;
        var messageSentLongAgo = Date.parse(dateOfMessage) < Date.parse(dateLastYear);

        if (messageSentToday && appendTodayToFirstMessage === 0) {
          // Case when messages are sent today and requires 'Today' helper text
          if (message.user_from === user.id) {
            appendDateHelper('Today');
            appendMessageFrom(data.userTo, data.userFrom, message);
          } else {
            appendDateHelper('Today');
            appendMessageTo(data.userTo,data.userFrom, message);
          }

          appendTodayToFirstMessage++;
        } else if (messageSentYesterday && appendYesterdayToFirstMessage === 0) {
          // Case when messages are sent yesterday and requires 'Yesterday' helper text
          if (message.user_from === user.id) {
            appendDateHelper('Yesterday');
            appendMessageFrom(data.userTo, data.userFrom, message);
          } else {
            appendDateHelper('Yesterday');
            appendMessageTo(data.userTo, data.userFrom, message);
          }

          appendYesterdayToFirstMessage++;
        }
        else if(messageSentLastWeek && appendLastWeekFirstMessage === 0){
          if(message.user_from === user.id){
            appendDateHelper(dateOfMessage.split(' ')[0]);
            appendMessageFrom(data.userTo, data.userFrom, message);
          }else{
            appendDateHelper(dateOfMessage.split(' ')[0]);
            appendMessageTo(data.userTo, data.userFrom, message);
          }
          appendLastWeekFirstMessage++;
        }
        else if(messageSentLastYear && appendLastYearFirstMessage === 0){
          if(message.user_from === user.id){
            appendDateHelper(dateOfMessage.split(' ').slice(0, 3).join(' '));
            appendMessageFrom(data.userTo, data.userFrom, message);
          }else{
            appendDateHelper(dateOfMessage.split(' ').slice(0, 3).join(' '));
            appendMessageTo(data.userTo, data.userFrom, message);
          }
          appendLastYearFirstMessage++;
        }
        else if(messageSentLongAgo && appendLongAgoFirstMessage ==0){
          if(message.user_from === user.id){
            appendDateHelper(dateOfMessage);
            appendMessageFrom(data.userTo, data.userFrom, message);
          }else{
            appendDateHelper(dateOfMessage);
            appendMessageTo(data.userTo, data.userFrom, message);
          }
          appendLongAgoFirstMessage++;
        }
        else {
          // Normal case with no date helpers appended

          if (message.user_from === user.id) {
            appendMessageFrom(data.userTo, data.userFrom, message);
          } else {
            appendMessageTo(data.userTo,data.userFrom, message);
          }
        }
      }


      var readCounter = 0;
      var readMessage = data.bulk_messages[data.bulk_messages.length -1];
      console.log(readMessage);
      if(readMessage.read_by_recipient && readMessage.user_from == user.id){
        console.log("READ");
        $('#messages').append('<div class="read_col user_to col-md-12"><div class="col-md-9"><p class="read"><i class="fa fa-check" aria-hidden="true"></i> Read </p> </div></div>')
      }
      else{
        $('.read_col').remove();
      }
      $('#messages-list').scrollTop($("#messages-list")[0].scrollHeight);
    }

  });

  /* -------------- */

});

function appendDateHelper(helperString) {
  $('#messages').append('<div class="date-of-message col-md-12"><span class="date-of-message">' + helperString + '</span></div>');
}

function appendMessageTo(userTo, userFrom, message) {
  if(userTo.id == user.id){
    //Fixing reverse get message bug
    $('#messages').append('<div class="user_to col-md-12"><img class="col-md-1" src=' + userFrom.profile_picture + ' /><div class="col-md-9"><span class="user_to">' + '<a href="/user/profile">' + userFrom.username + ':</a></span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
  }
  else{
    $('#messages').append('<div class="user_to col-md-12"><img class="col-md-1" src=' + userTo.profile_picture + ' /><div class="col-md-9"><span class="user_to">' + '<a href="/user/profile">' + userTo.username + ':</a></span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
  }

}

function appendMessageFrom(userTo, userFrom, message) {
  if(userFrom.id != user.id){
    // Fixing the reverse get message bug
    $('#messages').append('<div class="user_from col-md-12"><img class="col-md-1" src=' + userTo.profile_picture + ' /><div class="col-md-9"><span class="user_from">' + '<a href="/user/profile">' + userTo.username + ':</a></span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
  }
  else{
    $('#messages').append('<div class="user_from col-md-12"><img class="col-md-1" src=' + userFrom.profile_picture + ' /><div class="col-md-9"><span class="user_from">' + '<a href="/user/profilr">' +  userFrom.username + ':</a></span><li>' + message.message + '</li></div><div class="col-md-2 timestamp">' + retrieveTime(message.created_at) + '</div></div><br>');
  }

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
