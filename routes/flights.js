var express = require('express');
var router = express.Router();
var flightsCtrl = require('../controllers/flights');

// All these routes start with "/flights"

//GET /flights (render index of flights route)
router.get('/', flightsCtrl.index);
// GET /flights/new
router.get('/new', flightsCtrl.new);
// POST /flights (handle new flight posted)
router.post('/', flightsCtrl.create); 


module.exports = router;
