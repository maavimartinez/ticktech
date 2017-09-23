var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var dateFormat = require('dateformat');
var mongoose = require('mongoose');

var Ticket = require('../models/tickets');
var User = require('../models/users');

router.get('/createTicket', function(req, res) {
    res.render('createTicket',{layout: 'layoutDashboard', loggedUser: req.user});
});

router.get('/authorizeAccount', function(req, res) {
    res.render('authorizeAccount',{layout: 'layoutDashboard', loggedUser: req.user});
});

router.get('/dashboardHome', function(req, res) {
    var ticketsList = Ticket.find()
        .sort({title: 'asc'})
        .exec(function (err, ticketsList) {
            if (err) { return next(err); }
            res.render('dashboardHome', { layout: 'layoutDashboard', ticketsList: ticketsList, loggedUser: req.user });
        });

});

router.get('/addTicket', function(req, res) {
    User.find({}, 'email')
        .sort({email: 'asc'})
        .exec(function (err, listUsers) {
            if (err) { return err; }
            res.render('addTicket', { layout: 'layoutDashboard', author: req.user.email, userOptions: listUsers, creationDate: dateFormat(Date.now(), "dd-mm-yyyy"), loggedUser: req.user });
        });
});

router.post('/addTicket', function(req, res){
    console.log(req.body);
    var title = req.body.title;
    var status = req.body.selectStatus;
    var body = req.body.body;

    var assignee = User.findOne({ 'email': req.body.selectAssignee})
                        .exec(function (err, foundAssignee) {
                         console.log(foundAssignee);
                         if (err) { return next(err); }
        });

    var author = User.findOne({ 'email': req.body.author})
        .exec(function (err, foundAuthor) {
            console.log(foundAuthor);
            if (err) { return next(err); }
        });

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('body', 'A ticket description is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('addTicket',{
            errors:errors
        });
    } else {
        Ticket.findOne({ 'title': req.body.title})
            .exec( function(err, found_title) {
                console.log('found_title: ' + found_title);
                if (err) { return next(err); }
                if (found_title) {
                    req.flash('error_msg', 'A ticket already exists with that name');
                    res.redirect('/dashboard/addTicket');
                }
                else {
                    var newTicket = new Ticket({
                        title: title,
                        status: status,
                        author: author,
                        assignee: assignee,
                        body: body,
                        created: dateFormat(Date.now(), "dd-mm-yyyy")
                    });
                    Ticket.createTicket(newTicket, function (err,ticket) {
                        if (err) throw err;
                        console.log(ticket);
                    });
                    req.flash('success_msg', 'Ticket created');
                }
            });
    }
    console.log('llegue hasta aca');
    res.redirect('/dashboard/dashboardhome');
});


module.exports = router;
