const express = require('express');
const router = express.Router();
const ticketsCtrl = require('../controllers/tickets');

// GET , render new ticket view
router.get('/flights/:id/tickets/new', ticketsCtrl.new);

// POST /flights/:id/reviews
router.post('/flights/:id/tickets', ticketsCtrl.create);
// DEL /flights/:id/reviews

router.delete('/flights/:id/tickets', ticketsCtrl.delete);
module.exports = router;