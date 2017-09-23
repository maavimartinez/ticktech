var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var Ticket = require('../models/tickets');

router.get('/createTicket', function(req, res) {
    res.render('createTicket',{layout: 'layoutDashboard'});
});

router.get('/authorizeAccount', function(req, res) {
    res.render('authorizeAccount',{layout: 'layoutDashboard'});
});

router.get('/dashboardHome', function(req, res) {
    res.render('dashboardHome',{layout: 'layoutDashboard'});
});

router.get('/addTicket', function(req, res) {
    res.render('addTicket',{layout: 'layoutDashboard'});
});

router.post('/addTicket', function(req, res){
    var title = req.body.title;
    var status = req.body.status;
    var assignee = req.body.assignee;
    var body = req.body.body;

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
                       // author: ,
                        assignee: assignee,
                        body: body,
                        created: Date.now()
                    });
                    Ticket.createTicket(newTicket, function (err,ticket) {
                        if (err) throw err;
                        console.log(ticket);
                    });
                    req.flash('success_msg', 'Ticket created');
                }
            });
    }
    res.redirect('/dashboard/dashboardhome');
});




module.exports = router;
