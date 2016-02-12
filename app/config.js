var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:4568');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection ERROR'));

db.once('open', function(){
  console.log('CONNECT ON!!!1!!111!!!');
});



module.exports = db;
