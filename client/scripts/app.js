class App {
  // Want List
  // 1. Query list of all rooms
  // 2. Be able to select room on load 
  // 3. Open all the rooms as master user
  // Initial values
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
    this.username = window.location.search.split('=').pop();
    this.rooms = {};
    this.friends = {};
  }
  // Initialize the webpage
  init() {
    this.fetch(data => {
      // var rooms = {};
      data.results.forEach(message => { 
        if (!!message.roomname) { 
          this.rooms[message.roomname.trim()] = true; 
        }
        this.renderMessage(message);
      });
      
      Object.keys(this.rooms).forEach(room => {
        this.renderRoom(room);
      });

    });
  }

  // Refresh the page according selected room name(s)
  refresh(query) {
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
    }, query);
  }
  // takes message object and callback function (cb)
  // send out post message request to server
  send(message, cb) {
    $.ajax({
      // This is the url you should use to communicate with the parse API.
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
  // Query the information from parse API.
  fetch(cb, query) {
    console.log('??', query);
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: query || { 
        order: '-createdAt',
        // where: { roomname: "lobby"}
      },
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
  // empties/deletes all chat elements
  clearMessages() {
    $('#chats').empty();
  }
  // Takes one message object
  // Adds the chat element messages
  renderMessage(message) {
    var $messageDiv = $('<div class = "message"></div>');
    $messageDiv.append('<span class = "roomname">From ' + this._escapeHtml(message.roomname) + ': </span>');
    $messageDiv.append(`<span class = "username ${this._convertToClassName(message.username)}">${this._escapeHtml(message.username)}</span>: `);
    $messageDiv.append('<span class = "text">' + this._escapeHtml(message.text) + '</span>');
    $messageDiv.append('<span class = "text"> @' + this._escapeHtml(message.createdAt) + '</span>');
    $('#chats').append($messageDiv);
  }
  // Takes newRoomName
  // Creates a new room, send auto message with new roomname.
  createRoom(newRoomName) {
    var message = { 
      username: this.username,
      text: `Welcome to my magic world of ${newRoomName}!`,
      roomname: newRoomName
    };
    if (this.rooms[newRoomName] !== undefined ) { //--------------room exist when creating new room
      alert('The room already exist, you are going to this existed room');
      $('#roomSelect').val(newRoomName);
      this.refresh();
    } else {
      this.send(message, () => {
        // console.log(newRoomName);
        this.renderRoom(newRoomName);
        $('#roomSelect').val(newRoomName);
        this.refresh();
      });        
    }
  }
  // Takes roomName
  // Addes room element to the room selector
  renderRoom(roomName) {
    var text = this._escapeHtml(roomName);
    // console.log(text);
    $('#roomSelect').append(`<option class="${text}" value="${text}">${text}</option>`);
  }
  // Takes a username, converts to className
  // Adds className to friends list
  // Adds 'friend' class to all message boxes associated with that friend
  handleUsernameClick(username) {
    var className = this._convertToClassName(username);
    this.friends[className] = true;
    console.log(this.friends);
    $('.' + className).closest('.message').addClass('friend');
  }

  // Submits a message to the Parse API and refreshes the chat messages
  handleSubmit(message) {
    this.send(message, () => {
      this.refresh();
    });
  }

  handleRoomChange() {
    var selectedRoom = $('#roomSelect').val();
    if (selectedRoom === 'createRoom') {
      selectedRoom = prompt('Enter a room to create:');
      if (selectedRoom !== null) {
        this.createRoom(selectedRoom.trim());
      } 
    } else {
      var query = {
        order: '-createdAt',
        where: { roomname: selectedRoom }        
      };
      this.refresh(query);
    }
  }


  _escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  _convertToClassName(str = 'undefined') {
    return str.replace(/[^\w-_]/g, '').slice(0, 20);
  }


}

var app = new App(); // for Mocha test only, better put it inside document.ready.

$(document).ready(function() {
  app.init();
  // befriend when clicked on username in DOM
  $('#chats').on('click', '.username', function(event) {
    app.handleUsernameClick($(this).text());
  });
  //send user's messager
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
  });
  //Select the room
  $('#send').on('change', '#roomSelect', () => {
    app.handleRoomChange();
  });
});







