var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost:27017/nodeauth');
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
   username: {type: String, index: true},
   password: {type: String, bcrypt: true, required: true},
   email: {type: String},
   name: {type: String},
   profileimage: {type: String}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.comparePassword = function(candidatepass, hash, callback){
    bcrypt.compare(candidatepass, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username: username};
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.createUser = function(newUser, callback){
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) throw err;
        // set hash password
        newUser.password = hash
        // create user
        newUser.save(callback);
    });
}