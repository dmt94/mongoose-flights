const { render } = require('express/lib/response');
const Flight = require('../models/flight');
const mongoose = require('mongoose');

module.exports = {
  index,
  new: newFlight,
  create,
  show,
  delete: deleteDestination,
}
function getDefaultData(respond, presentTime=null, link) {
  Flight.find({}, function(err, flights) {
    renderAll(respond, flights, presentTime=null,link)
  })
}

function renderAll(respond, flights, presentTime=null, link, dataType) {
  let schemaObj = Flight.schema.obj;
  let arrs = Object.entries(schemaObj).filter((objPair) => objPair[0] !== "destinations");
  schemaObj = Object.assign({}, Object.fromEntries(arrs));
  let schemaObjKeys = Object.keys(schemaObj);
  
  respond.render(link, {
    title: dataType === "arrival" ? "Flight Detail" : "View All Flights", 
    flights,
    presentTime,
    schemaObjKeys,
  })
}
function sortDataBy(dataKey, res, req, presentTime=null, link) {
  req.query.sort === "asc" ? getSortedData(req, res, presentTime, dataKey, link) : getSortedData(req, res, presentTime, `-${dataKey}`, link);
}
function getSortedData(req, res, presentTime=null, dataType, link) {
  let flightsData = Flight.find({});
  let destSchema = Flight.schema.obj.destinations[0].obj;
  
  if (dataType === "arrival") {
    Flight.findById(req.params.id).exec(function(err, flight) {
      let destinationAirports = flight.destinations.map((destination) => {
        return destination.airport
      });
      let availableDestinations = destSchema.airport.enum.filter((airport) => !destinationAirports.includes(airport) && airport !== flight.airport);

      flight.destinations.sort((a, b) => {
        return a.arrival - b.arrival;
      })
      renderShowDefault(req, res, "Flight Details", flight, availableDestinations);
    })} else if (dataType === "-arrival") {
      Flight.findById(req.params.id).exec(function(err, flight) {
        let destinationAirports = flight.destinations.map((destination) => {
          return destination.airport
        });
        let availableDestinations = destSchema.airport.enum.filter((airport) => !destinationAirports.includes(airport) && airport !== flight.airport);
        flight.destinations.sort((a, b) => {
          return b.arrival - a.arrival;
        })
        renderShowDefault(req, res, "Flight Details", flight, availableDestinations);
      })
    } else {
    flightsData.sort(dataType)
    .exec(function(err, flights) {
      console.log("flights data", flightsData);
      renderAll(res, flights, presentTime=null, link, dataType);
    })
  }
}

function index(req, res) {
  let presentTime = new Date().getTime();

  if (req.query.type === 'departs') {
    sortDataBy('departs', res, req, presentTime, "flights/index");
  } else if (req.query.type === 'flightNo') {
    sortDataBy('flightNo', res, req, presentTime, "flights/index");
  }  else if (req.query.type === 'airport') {
    sortDataBy('airport', res, req, presentTime, "flights/index");
  }  else if (req.query.type === 'airline') {
    sortDataBy('airline', res, req, presentTime, "flights/index");
  } else {
    getDefaultData(res, presentTime, "flights/index")
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

function renderShowDefault(req, res, title, flight, availableDestinations) {
  res.render('flights/show', {
    title: title,
    flight,
    availableDestinations
  })
}

function show(req, res) {
  let destSchema = Flight.schema.obj.destinations[0].obj;
  Flight.findById(req.params.id, function(err, flight) {
    let destinationAirports = flight.destinations.map((destination) => {
      return destination.airport
    });
    
    let availableDestinations = destSchema.airport.enum.filter((airport) => !destinationAirports.includes(airport) && flight.airport !== airport);

    let sortType = req.query.type;
    if (sortType) {
      let destLink = `flights/show`;
      sortDataBy("arrival", res, req, null, destLink);
    } else {
      renderShowDefault(req, res, "Flight Details", flight, availableDestinations);
    }
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