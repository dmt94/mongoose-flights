const express = require('express');
const router = express.Router();
const destinationsCtrl = require('../controllers/destinations');


// POST /flights/:id/reviews
router.post('/flights/:id/destinations', destinationsCtrl.create);

router.delete('/flights/:id/destinations', destinationsCtrl.delete);

module.exports = router;