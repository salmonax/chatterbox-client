var message = {
  username: 'newUser',
  text: 'Something really, really new',
  roomname: '23chan'
};
var message2 = {
  username: 'newUser',
  text: 'Something really, really new',
  roomname: '23chan'
};

class App {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
    this.username = window.location.search.split('=').pop();
        // console.log(this.username);
  }

  init() {
  }

  send(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // data.results.forEach(function(result) {
        //   console.log(result.text);
        //   console.log(result.createdAt);
        //   console.log(result.roomname);
        //   console.log(result.username);

        // });
        console.log('chatterbox: Message sent');
        // console.log (data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch(cb) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: "order=-createdAt",
      contentType: 'application/json',
      success: function(data) {
        cb(data);
      },
      // function (data) {
      //   data.results.forEach(function(result) {
      //     console.log(result.text);
      //     console.log(result.createdAt);
      //     console.log(result.roomname);
      //     console.log(result.username);

      //   });
        // console.log('chatterbox: Message sent');
        // console.log (data);
      // },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  clearMessages() {
    $('#chats').empty();
  }

  renderMessage(message) {
    var $messageDiv = $('<div class = "message"></div>');
    $messageDiv.append('<span class = "roomname">From ' + this._escapeHtml(message.roomname) + ': </span>');
    $messageDiv.append('<span class = "username">' + this._escapeHtml(message.username) + ': </span>');

    $messageDiv.append('<span class = "text">' + this._escapeHtml(message.text) + '</span>');
    $messageDiv.append('<span class = "text"> @' + this._escapeHtml(message.createdAt) + '</span>');
    $('#chats').append($messageDiv);
  }

  renderRoom(roomName) {
    var text = this._escapeHtml(roomName);
    console.log(text);
    $('#roomSelect').append(`<option class="${text}" value="${text}">${text}</option>`);
  }

  handleUsernameClick() {
  }

  handleSubmit() {

  }

  _escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}

var app = new App();

$(document).ready(function() {
  app.fetch(function (data) {
    // console.log(data.results);
    var rooms = {};
    data.results.forEach(message => { 
      if (!!message.roomname) { 
        rooms[message.roomname.trim()] = true; 
      }
      app.renderMessage(message);
    });
    Object.keys(rooms).forEach(function(room) {
      app.renderRoom(room);
    });

  });
  $('#chats').on('click', '.username', function(event) {
    console.log('clicked');
    app.handleUsernameClick();
  });
  $('#send').on('submit', function(event) {
    console.log(window.location.search);
    // return false;
    event.preventDefault();
    // console.log('submited');
    // console.log(event.target);
    console.log($(this).find('.text').val());  
    console.log($(this).find('#roomSelect').val()); 
    console.log(app.username);
    var message = {
      username: app.username,
      text: $(this).find('.text').val(),
      roomname: $(this).find('#roomSelect').val()
    };
    console.log('pass message to app.send');
    app.send(message);
    // return false;
  });
});


// app.send(message);




