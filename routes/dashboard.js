var express = require('express');
var exphbs = require('express-handlebars');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var async = require('async');
var dateFormat = require('dateformat');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Ticket = require('../models/tickets');
var User = require('../models/users');

router.get('/createTicket', function(req, res) {
    res.render('createTicket',{layout: 'layoutDashboard', loggedUser: req.user});
});

router.get('/authorizeAccount', function(req, res) {
    res.render('authorizeAccount',{layout: 'layoutDashboard', loggedUser: req.user});
});

router.get('/dashboardHome', function(req, res, next) {
    Ticket.find()
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

router.get('/editTicket/:id', function(req, res){
    var title = req.params.id;
    Ticket.findOne({title: title}, function (err, foundTicket) {
        if(err){console.log(err);}
        res.render('editTicket',
            {layout: 'layoutDashboard', loggedUser: req.user,
                selectedTicket: foundTicket,
                created: dateFormat(foundTicket.created, "dd-mm-yyyy")
            });
    });
});

router.get('/deleteTicket/:id', function(req, res){
    var title = req.params.id;
    console.log(req.params);
    console.log(title);
    Ticket.findOneAndRemove({title: title}, function (err) {
        if(err){console.log(err);}
        req.flash('success_msg', 'Ticket deleted');
        res.redirect('/dashboard/dashboardhome');
    });
});

router.post('/addTicket', function(req, res, next){
    var title = req.body.title;
    var status = req.body.selectStatus;
    var body = req.body.body;
    var selectedAuthor = User.findOne({ 'email': req.body.author})
        .exec( function(err, foundUser) {
            if (err) { return next(err); }
        });
    var selectedAssignee = User.findOne({ 'email': req.body.selectAssignee})
        .exec( function(err, foundUser) {
            if (err) { return next(err); }
        });

    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('body', 'A ticket description is required').notEmpty();

    var errors = req.validationErrors();

    if(errors){
        res.render('addTicket',{errors:errors});
    } else {
        Ticket.findOne({ 'title': req.body.title})
            .exec( function(err, found_title) {
                console.log('found_title: ' + found_title);
                if (err) { return err; }
                if (found_title) {
                    req.flash('error_msg', 'A ticket already exists with that name');
                    res.redirect('/dashboard/addTicket');
                }
                else {
                    var ticket = new Ticket();
                    ticket.title = title;
                    ticket.status = status;
                    ticket.body = body;
                    ticket.created = Date.now();
                    ticket.author=  ObjectId(selectedAssignee._id);
                    ticket.assignee = ObjectId(selectedAssignee._id);
                    console.log(ticket);
                    ticket.save(function (err) {
                        if (err) { return next(err)};
                        Ticket.find()
                            .exec(function (err, Ticket) {
                                if (err) {return next(err)};
                                res.json(Ticket);
                            });
                    });
                    req.flash('success_msg', 'Ticket created');
                    res.redirect('/dashboard/dashboardhome');
                }
            });
    };
});

router.post('/editTicket/:id', function (req, res, next) {
    var title = req.params.id;
    Ticket.findOne({title: title}, function(err, ticket){
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            if(!ticket){
                res.status(404).send();
            }else{
                if(req.body.title){
                    ticket.title = req.body.title;
                }
                if(req.body.selectStatus){
                    ticket.status = req.body.selectStatus;
                }
                if(req.body.selectAssignee){
                    ticket.assignee = ObjectId(User.findOne({ 'email': req.body.selectAssignee})
                                                    .exec( function(err) {
                                                        if (err) { return next(err); }
                                                    })._id
                                                );
                }
                if(req.body.body){
                    ticket.body = req.body.body;
                }
                ticket.save(function (err, updatedTicket) {
                    if(err){
                        console.log(err);
                        res.status(500).send();
                    }else{
                        req.flash('success_msg', 'Ticket updated successfully');
                        res.redirect('/dashboard/dashboardhome');
                    }
                })
            }
        }
    })
});


module.exports = router;
