const express = require('express');
const { check } = require('express-validator');

const publicationsController = require('../controllers/publications-controller');

const router = express.Router();

router.get('/:pid', publicationsController.getPublicationById);

router.get('/user/:uid', publicationsController.getPublicationsByUserId);

router.post('/', [check('title').notEmpty(), check('discription').isLength({min: 5}), check('address').notEmpty()], publicationsController.createPublication);

router.patch('/:pid', [check('title').notEmpty(), check('discription').isLength({min: 5})], publicationsController.updatePublication);

router.delete('/:pid', publicationsController.deletePublication);

module.exports = router;
