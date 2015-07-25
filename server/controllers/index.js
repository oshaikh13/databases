var models = require('../models');
var bluebird = require('bluebird');


module.exports = {
  messages: {
    get: function (req, res) {
      //console.log(req.url + " at messages get");
      models.messages.get(function(err, resp, allMessages){
        var stringified = JSON.stringify(allMessages);
        res.end(stringified);
      });
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      //console.log(req.url + " at messages post");
      models.messages.post(req.body, function(){
        res.end();
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    get: function (req, res) {
      models.users.get(function(err, resp, username){
        res.end(JSON.stringify(resp));
      });
    },
    post: function (req, res) {
      //console.log(req.url + " at users post");
      models.users.post(req.body, function(userId){
        res.end(JSON.stringify(userId));
      });  
    }
  }
};

