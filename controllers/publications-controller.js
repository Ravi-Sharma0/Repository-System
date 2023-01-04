const uuid = require('uuid');
const { validationResult} = require('express-validator');

const Errors = require('../models/errors');
const Publication = require('../models/publication');
const User = require('../models/user');
const { default: mongoose } = require('mongoose');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapers in the world!',
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    }
   ];

const getPublicationById = async (req, res, next) => {
    const publicationId = req.params.pid;
    let publication;

    try {
        publication = await Publication.findById(publicationId);
    } catch (err) {
        const error = new Errors(
            'Something went wrong, could not find a publication.',
            500
        );
        return next(error);
    }

    if(!publication) {
        throw new Errors('Could not find a place for provided id.', 404);
    }

    res.json({ publication: publication.toObject( {getters: true }) });
}; //function getPlaceById

const getPublicationsByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let publications;

    try {
        publications = await Publication.find({ creator: userId });
    } catch (err) {
        const error = new Errors(
            'Fetching publication failed, please try again.',
            500
        );
        return next(error);
    }

    if(!publications || publications.length === 0) {
        return next(new Errors('Could not find placse for provided user id.', 404));
    }

    res.json({ publications: publications.map(publication => publication.toObject({ getters: true })) });
};

const createPublication = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next( new Errors('Invalid inputs passed, please check your data.', 422));
    }
    
    const { department, school, title, year, date, author, journal, volume, page, issue, doi, type, scopus, wos, ugc, crossref, scopuscitation, access, creator} = req.body;
    //const title = req.body.title;
    const createdPublication = new Publication({
        department,
        school,
        title,
        year,
        date,
        author,
        journal,
        volume,
        page,
        issue,
        doi,
        type,
        scopus,
        wos,
        ugc,
        crossref,
        scopuscitation,
        access,
        creator

    });

    let user;

    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new Errors(
            'Creating publication failed, please try again',
            500
        );
        return next(error);
    }

    if(!user){
        const error = new Errors('Could not find user for provided id', 404);
        return next (error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await createdPublication.save({ session: session});
        user.publications.push(createPublication);
        await user.save({ session: session});
        await session.commitTransaction();
    } catch (err) {
        const error = new Errors(
            'Creating publication failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({publication: createdPublication});
};

const updatePublication = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next( new Errors('Invalid inputs passed, please check your data.', 422));
    }

    const { title, description} = req.body;
    const publicationId = req.params.pid;

    let publication;
    try {
        publication = await Publication.findById(publicationId);
    } catch (err) {
        const error = new Errors(
            'Something went wrong, could not update publication.',
            500
        );
        return next(error);
    }

    publication.title = title;
    publication.description = description;

    try {
        await publication.save();
    } catch (err) {
        const error = new Errors(
            'Something went wrong, could not update publication.',
            500
        );
        return next(error);
    }

    res.status(200).json({publication: publication.toObject({ getters: true })});
};

const deletePublication = async (req, res, next) => {
    const publicationId = req.params.pid;
    
    let publication;
    try {
        publication = await Publication.findById(publicationId);
    } catch (err) {
        const error = new Errors(
            'Something went wrong, could not delete publication.',
            500
        );
        return next(error);
    }

    try {
        await publication.remove();
    } catch (err) {
        const error = new Errors(
            'Something went wrong, could not delete publication.',
            500
        );
        return next(error);
    }

    res.status(200).json({message: 'Deleted publication.'});
};

exports.getPublicationById = getPublicationById;
exports.getPublicationsByUserId = getPublicationsByUserId;
exports.createPublication = createPublication;
exports.updatePublication = updatePublication;
exports.deletePublication = deletePublication;

