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
    this.fetch(data => {
      var rooms = {};
      data.results.forEach(message => { 
        if (!!message.roomname) { 
          rooms[message.roomname.trim()] = true; 
        }
        this.renderMessage(message);
      });
      Object.keys(rooms).forEach(room => {
        this.renderRoom(room);
      });

    });
  }

  refresh() {
    var selectedRoom = $('#roomSelect').val();
    $('#chats').empty();
    this.fetch(data => {
      data.results.forEach(message => { 
        if (selectedRoom === 'allRooms' ||
            !!message.roomname && 
            message.roomname.trim() === selectedRoom) { 
          this.renderMessage(message); 
        }
      });
    });
  }

  send(message,cb) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        cb(data);
        console.log('chatterbox: Message sent');
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

  handleSubmit(message) {
    this.send(message, () => {
      this.refresh();
    });
  }

  _escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
}

var app = new App();

$(document).ready(function() {
  app.init();
  $('#chats').on('click', '.username', function(event) {

    app.handleUsernameClick();
  });
  $('#send').on('submit', function(event) {
    // return false;
    event.preventDefault();
    var roomSelected = $(this).find('#roomSelect').val();
    var message = { 
      username: app.username,
      text: $(this).find('.text').val(),
      roomname: (roomSelected === 'allRooms') ? 'lobby' : roomSelected
    };
    app.handleSubmit(message);
    // return false;
  });
  $('#send').on('change', '#roomSelect', () => {
    var selectedRoom = $('#roomSelect').val();
    if (selectedRoom === 'createRoom') {
      selectedRoom = prompt('Enter a room to create:');
      var message = { 
        username: app.username,
        text: `Welcome to my magic world of ${selectedRoom}!`,
        roomname: selectedRoom
      };
      app.send(message, () => {
        app.init();
      });
      console.log(selectedRoom)
    } else {
      app.refresh();
    }
  });
});


// app.send(message);




