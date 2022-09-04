const express = require('express');

const placesController = require('../controllers/places-controller');

const router = express.Router();

router.get('/:pid', placesController.getPlaceById);

router.get('/user/:uid', placesController.getPlaceByUserId);

router.post('/', placesController.createPlace);

module.exports = router;
