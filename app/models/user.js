var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var mongoose = require('mongoose');


var userSchema = mongoose.Schema({
  username: {type: String, index:{ unique: true }},
  password: String
});

var User = mongoose.model('User', userSchema);


userSchema.pre('save', function(next){
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

User.prototype.comparePassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, match){
    if(err){
      callback(err);
    } else {
      callback(null, match);
    }
  });
};


module.exports = User;
