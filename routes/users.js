var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var User = require('../models/users');

router.get('/login', function (req, res) {
    res.render('login');
});

router.get('/register', function (req, res) {
    res.render('register');
});

router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email.toLowerCase();
    var password = req.body.password;
    User.findOne({ 'email': req.body.email })
        .exec(function (err, found_email) {
            if (err) {
                return next(err);
            }
            if (found_email) {
                req.flash('error_msg', 'Email already used');
                res.redirect('/users/register');
            } else {
                var newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    email: email,
                    password: password,
                    pending: true,
                });
                User.createUser(newUser, function (err) {
                    if (err) throw err;
                    res.redirect('/users/login');
                });
            }
        });
});

passport.use(new LocalStrategy({ usernameField: 'email' },
    function (email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            if (user.pending) {
                return done(null, false, { message: 'Pending Authorization' });
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
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
        successRedirect: '/dashboard/dashboardhome',
        failureRedirect: '/users/login',
        failureFlash: true
    })
);

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/users/login');
});

router.get('/', function (req, res, next) {
    User.find(function (err, users) {
        if (err) return console.error(err);
        res.render('/users/login', { users: users })
    })
})

module.exports = router;
