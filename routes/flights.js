var express = require('express');
var router = express.Router();
var flightsCtrl = require('../controllers/flights');

// All these routes start with "/flights"

// GET /flights (render index of flights route)
router.get('/', flightsCtrl.index);
// GET /flights/new
router.get('/new', flightsCtrl.new);
// GET /flights/:id (display details page for flight
router.get('/:id', flightsCtrl.show);

// POST /flights (handle new flight posted)
router.post('/', flightsCtrl.create); 

// DELETE 
router.delete('/:id', flightsCtrl.delete);

module.exports = router;
