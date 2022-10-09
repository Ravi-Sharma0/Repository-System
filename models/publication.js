const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const publicationSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    creator: { type: String, required: true }
});

module.exports = mongoose.model('Publication', publicationSchema);

