$(document).ready(function() {

  var socket = io();

  $("div.list-group a").click(function(e) {
    e.preventDefault();
    //
    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");

    // NOTE: The room names are always sorted from smaller number to higher number
    // NOTE: Room names are the same even if reversed
    // 
    // var userToID = $(this).attr("id").split("-")[1];
    // var userFromID = user.id;
    // var roomName;
    // if (userFromID > userToID) {
    //   roomName = user
    // } else {
    //   roomName =
    // }

    console.log(roomName);


    // var index = $(this).index();
    // $("div.settings-tab div.settings-tab-content").removeClass("active");
    // $("div.settings-tab div.settings-tab-content").eq(index).addClass("active");
  });

  $(".list-group-item:nth-child(2)").addClass("active");

  /* Socket IO Client */




  socket.emit('add user', { userFrom: user });

  $('form').submit(function() {
    var msg = $('#m').val();
    var userTo = $('.list-group-item.active').attr("id").split("-")[1];

    socket.emit('private message', { userFrom: user, userTo: userTo, msg: msg });
    $('#m').val('');

    return false;
  });

  socket.on('private message', function(data){
    console.log(data);
    console.log("Sender name:");
    console.log(data.userFrom.username);
    $('#messages').append('<span class="">' + data.userFrom.username + ':</span><li>' + data.msg + '</li><br>');
  });

  /* -------------- */

});
