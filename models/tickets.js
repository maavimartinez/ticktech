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
        type: Schema.Types.Mixed
    },
    assignee: {
        type: Schema.Types.Mixed
    },
    created: {
        type: Date,
    }
});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);


module.exports.formatedTicketList = function () {
    var list = [];
    Ticket.find()
        .sort({title: 'asc'})
        .exec(function (err, ticketsList) {
            if (err) { return next(err); }
            if(ticketsList){
                for (var i = 0;i<ticketsList.length;i++){
                    list[i].author = User.findOne({_id: ticketsList[i].author}).exec().email;
                    list[i].assignee = User.findOne({_id: ticketsList[i].assignee}).exec().email;
                    list[i].created = ticketsList[i].created;
                    list[i].body = ticketsList[i].body;
                    list[i].title = ticketsList[i].title;
                }
            }
            return list;
        });
}

