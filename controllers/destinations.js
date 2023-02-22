const Flight = require('../models/flight');

module.exports = {
  create,
  delete: deleteDestination,
}

function create(req, res) {
  Flight.findById(req.params.id, function(err, flight) {

    flight.destinations.push(req.body);

    flight.save(function(err) {
      res.redirect(`/flights/${flight._id}`)
    });
  })
}

function deleteDestination(req, res) {
  let destinationId = req.query.destId;
  Flight.findOne({_id: req.params.id}, function(err, flight) {
    flight.destinations.remove(destinationId);
    flight.save(function(err) {
      res.redirect(`/flights/${req.params.id}`);
    })
  });
}
