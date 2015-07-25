// YOUR CODE HERE:
app = {

    // server: 'https://api.parse.com/1/classes/chatterbox',
    server: 'http://127.0.0.1:3000/classes/messages',
    userPost: 'http://127.0.0.1:3000/classes/users',

    init: function() {
      console.log('running chatterbox');
      // Get username
      app.username = window.location.search.substr(10);
      console.log(app.username)
      $.ajax({
        type: 'POST',
        url: app.userPost,
        data: JSON.stringify({username: app.username}),
        contentType: 'application/json',
        success: function(json){
          console.log(json);
          app.userId = json;
        },
        complete: function(){
          app.stopSpinner();
        }
      });

      $.ajax({
        type: 'GET',
        url: app.userPost,
        data: JSON.stringify({username: app.username}),
        contentType: 'application/json',
        success: function(json){
          app.users = JSON.parse(json);
          console.log(app.users);
        },
        complete: function(){
          app.stopSpinner();
        }
      });

      app.onscreenMessages = {};
      app.blockedUsers = ['BRETTSPENCER', 'Chuck Norris'];

      // cache some dom references
      app.$text = $('#message');


      app.loadMsgs();
      setInterval( app.loadMsgs.bind(app), 1000);

      $('#send').on('submit', app.handleSubmit);
    },

    handleSubmit: function(e){
      e.preventDefault();

      var message = {
        user: app.userId,
        message: app.$text.val(),
        room: 1
      };

      app.$text.val('');

      app.sendMsg(message);
    },

    renderMessage: function(message){
      var $user = $("<div>", {class: 'user'}).text(message.user);
      var $text = $("<div>", {class: 'text'}).text(message.message);
      var $message = $("<div>", {class: 'chat', 'data-id': message.id }).append($user, $text);
      return $message;
    },

    displayMessage: function(message){
      if( app.blockedUsers.indexOf(message.username) < 0 ){
        if( !app.onscreenMessages[message.id] ){
          var $html = app.renderMessage(message);
          $('#chats').prepend($html);
          app.onscreenMessages[message.objectId] = true;
        }
      }
    },

    displayMessages: function(messages){
      $('#chats').html('');
      for( var i = 0; i < messages.length; i++ ){
        app.displayMessage(messages[i]);
      }
    },

    loadMsgs: function(){
      $.ajax({
        url: app.server,
        contentType: 'application/json',
        success: function(json){
          var results = JSON.parse(json);
          app.displayMessages(results);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    sendMsg: function(message){
      app.startSpinner();
      $.ajax({
        type: 'POST',
        url: app.server,
        data: JSON.stringify(message),
        contentType: 'application/json',
        success: function(json){
          message.objectId = json.objectId;
          app.displayMessage(message);
        },
        complete: function(){
          app.stopSpinner();
        }
      });
    },

    startSpinner: function(){
      $('.spinner img').show();
      $('form input[type=submit]').attr('disabled', "true");
    },

    stopSpinner: function(){
      $('.spinner img').fadeOut('fast');
      $('form input[type=submit]').attr('disabled', null);
    }
};
