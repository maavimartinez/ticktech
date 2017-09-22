var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/users');

router.get('/login', function (req,res) {
    res.render('login');
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res){
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors:errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            password: password
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

passport.use(new LocalStrategy({usernameField:'email'},
    function(email, password, done) {
        User.findOne({email:email}, function(err, user){
            if(err){
                return done(err);
            }
            if(!User){
                return done(null, false, {message: 'Incorrect username'});
            }
            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true})
);

router.get('/logout', function(req, res){
    req.logout();

    req.flash('success_msg', 'You are logged out');

    res.redirect('/users/login');
});

router.get('/', function (req, res, next) {
    User.find(function (err, users) {
        if(err) return console.error(err);
        res.render('/users/login', {users:users})
    })
})

module.exports = router;