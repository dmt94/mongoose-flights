const mongoose = require('mongoose');
const Ticket = require('../models/ticket');
const Flight = require('../models/flight');

module.exports = {
  new: newTicket,
  create,
  delete: deleteTicket,
}
function create(req, res) {
  let flightId = req.params.id;
  Flight.findById(flightId, function(err, flight){
    Ticket.create(req.body, function(err, ticket) {
      ticket.flight.push(flightId);
      ticket.save(function(err) {
        res.redirect(`/flights/${flight._id}`)
      })
    })
  })
}
function newTicket(req, res) {
  Flight.findById(req.params.id, function(err, flight){
      res.render(`tickets/new`, {
      title: "Add New Ticket",
      flight
    })
  })
}

//refactor later, move to destinations route + controller
function deleteTicket(req, res) {
  Ticket.deleteOne({"flight": req.params.id}, function(err, ticket) {
    res.redirect(`/flights/${req.params.id}`);
  })
}