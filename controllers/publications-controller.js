const uuid = require('uuid');
const { validationResult} = require('express-validator');

const Errors = require('../models/errors');
const Publication = require('../models/publication');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
   ];

const getPublicationById = (req, res, next) => {
    const publicationId = req.params.pid;
    const publication = DUMMY_PLACES.find(p => {
        return p.id === publicationId;
    });

    if(!publication) {
        throw new Errors('Could not find a place for provided id.', 404);
    }

    res.json({ publication });
}; //function getPlaceById

const getPublicationsByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const publication = DUMMY_PLACES.filter(p => {
        return p.creator === userId;
    });

    if(!publication || publication.length === 0) {
        return next(new Errors('Could not find placse for provided user id.', 404));
    }

    res.json({ publication });
};

const createPublication = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Errors('Invalid inputs passed, please check your data.', 422);
    }
    
    const { title, description, address, creator} = req.body;
    //const title = req.body.title;
    const createdPublication = new Publication({
        title,
        description,
        address,
        creator
    });

    try {
        await createdPublication.save();
        console.log('in');
    } catch (err) {
        const error = new Errors(
            'Creating place failed, please try again.',
            500
        );
        console.log('out');
        return next(error);
    }

    res.status(201).json({publication: createdPublication});
};

const updatePublication = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new Errors('Invalid inputs passed, please check your data.', 422);
    }

    const { title, description} = req.body;
    const publicationId = req.params.pid;

    const updatedPublication = { ...DUMMY_PLACES.find(p => p.id === publicationId) };
    const publicationIndex = DUMMY_PLACES.findIndex(p => p.id === publicationId);
    updatedPublication.title = title;
    updatedPublication.description = description;

    DUMMY_PLACES[publicationIndex] = updatedPublication;

    res.status(200).json({place: updatedPlace});
};

const deletePublication = (req, res, next) => {
    const publicationId = req.params.pid;
    if (!DUMMY_PLACES.find(p => p.id === publicationId)) {
        throw new Errors('Could not find a place for that id.', 404);
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== publicationId);

    res.status(200).json({message: 'Deleted publication.'});
};

exports.getPublicationById = getPublicationById;
exports.getPublicationsByUserId = getPublicationsByUserId;
exports.createPublication = createPublication;
exports.updatePublication = updatePublication;
exports.deletePublication = deletePublication;

