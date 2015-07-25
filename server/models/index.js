var db = require('../db/index.js');




module.exports = {
  messages: {
    get: function (callback) {

      var query = "SELECT * from messages";
      db.dbConnection.query(query, function(err, rows, fields){
        if (err) {
          throw err;
        }
        callback(err, fields, rows);
      })
    }, // a function which produces all the messages
    post: function (msg, callback) {

      var query = "INSERT INTO `messages` SET ?";
      db.dbConnection.query(query, msg, function(err, rows, fields){
        if (err) throw err;
        callback(rows, fields);
      });

    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function (callback) {
      var query = "SELECT * FROM `users`";
      db.dbConnection.query(query, function(err, rows, fields){
        if (err) throw err;
        callback(err, rows, fields);
      })

    },
    post: function (user, callback) {
      var query = "INSERT into `users` (`name`) VALUES ('" + user['username'] + "');";
      db.dbConnection.query(query, function(err, rows, fields){
        if (err) throw err;
        callback(rows.insertId);
      });
    }
  }
};

