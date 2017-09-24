var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('../models/users');
var dateFormat = require('dateformat');

var TicketSchema = mongoose.Schema({
    title: {
        type: String,
        index: true
    },
    body: {
        type: String,
    },
    status: {
        type: String,
        enum: ["open", "closed"],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    assignee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    created: {
        type: Date,
    }
});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);




