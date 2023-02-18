const { render } = require('express/lib/response');
const Flight = require('../models/flight');

module.exports = {
  index,
  new: newFlight,
  create
}
function getDefaultData(respond,presentTime) {
  Flight.find({}, function(err, flights) {
    renderAll(respond, flights, presentTime)
  })
}
function getSortedData(respond, presentTime, dataType) {
  Flight.find({})
  .sort(dataType)
  .exec(function(err, flights) {
    renderAll(respond, flights, presentTime)
  })
}
function renderAll(respond, flights, presentTime) {
  const schemaObj = Flight.schema.obj;
  const schemaObjKeys = Object.keys(schemaObj)
  respond.render('flights/index', {
    title: "View All Flights", 
    flights,
    presentTime,
    schemaObjKeys
  })
}
function sortDataBy(dataKey, res, req, presentTime) {
  req.query.sort === "asc" ? getSortedData(res, presentTime, dataKey) : getSortedData(res, presentTime, `-${dataKey}`);
}

function index(req, res) {
  let presentTime = new Date().getTime();

  if (req.query.type === 'departs') {
    sortDataBy('departs', res, req, presentTime);
  } else if (req.query.type === 'flightNo') {
    sortDataBy('flightNo', res, req, presentTime);
  }  else if (req.query.type === 'airport') {
    sortDataBy('airport', res, req, presentTime);
  }  else if (req.query.type === 'airline') {
    sortDataBy('airline', res, req, presentTime);
  } else {
  getDefaultData(res, presentTime)
  }
}

function newFlight(req, res) {
  const aNewFlight = new Flight();
  const dt = aNewFlight.departs;
  let departsDate = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, '0')}`;
  departsDate += `-${dt.getDate().toString().padStart(2, '0')}T${dt.toTimeString().slice(0, 5)}`;

  res.render('flights/new', {
    title: 'Add New Flight',
    departsDate
  })
}

function create(req, res) {
  // deletes empty properties on req.body
  for (let key in req.body) {
    if (req.body[key] === '') delete req.body[key];
  }
  const flight = new Flight(req.body);
  flight.save(function(err) {
    if (err) {
      console.log(err);
      return res.redirect('/flights/new')
    };
    res.redirect('/flights')
  });
}