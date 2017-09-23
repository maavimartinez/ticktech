var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TicketSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    body: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["open", "closed"],
    },
    author: {
        type:Schema.ObjectId,
        ref: 'User',
        required:true
    },
    assignee: {
        type:Schema.ObjectId,
        ref: 'User',
        required:true
    },
    created: {
        type: Date,
        default: Date.now(),
        required: true
    }
});

var Ticket = module.exports = mongoose.model('Ticket', TicketSchema);

module.exports.createTicket = function (newTicket, callback) {
        newTicket.save(callback);
};

