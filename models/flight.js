const mongoose = require('mongoose');
// Shortcut to the mongoose.Schema class
const Schema = mongoose.Schema;

const destinationSchema = new Schema({
  airport: {
    type: String,
    enum: [
      'AUS',
      'DFW',
      'DEN',
      'LAX',
      'SAN'
    ]
  },
  arrival: {
    type: Date
  }
}, {
  timestamps: true
});


const flightSchema = new Schema({
  airline: {
    type: String,
    enum: [
      'Southwest', 
      'American', 
      'United',
    ]
  },
  airport: {
    type: String,
    enum: [
      'AUS', 
      'DFW', 
      'DEN', 
      'LAX', 
      'SAN'
    ],
    default: 'DEN'
  },
  flightNo: {
    type: Number,
    required: true,
    min: 10,
    max: 9999
  },
  departs: {
    type: Date,
    default: function() {
      const presentDate = new Date();
      const presentDateCopy = new Date(presentDate);
      presentDateCopy.setFullYear(presentDateCopy.getFullYear() + 1);
      return presentDateCopy;
    }
  },
  destinations: [destinationSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Flight',flightSchema);