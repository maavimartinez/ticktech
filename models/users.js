var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.getUserByEMail = function(email, callback){
    var query = {email: email};
    User.findOne(query,callback);
};

module.exports.getUserById = function (email, callback) {
    User.findById(email, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};




