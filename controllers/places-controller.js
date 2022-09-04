const Errors = require('../models/errors');

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        location: {
          lat: 40.7484474,
          lng: -73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
   ];

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DUMMY_PLACES.find(p => {
        return p.id === placeId;
    });

    if(!place) {
        throw new Errors('Could not find a place for provided id.', 404);
    }

    res.json({ place });
}; //function getPlaceById

const getPlaceByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const place = DUMMY_PLACES.find(p => {
        return p.creator === userId;
    });

    if(!place) {
        return next(new Errors('Could not find a place for provided user id.', 404));
    }

    res.json({ place });
};

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator} = req.body;
    //const title = req.body.title;
    const createdPlace = {
        title,
        description,
        location: coordinates,
        address,
        creator
    };

DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)

res.status(201).json({place: createdPlace});
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
