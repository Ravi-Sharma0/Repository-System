const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const publicationSchema = new Schema({
    department: { type: String, required: true },
    school: { type: String, required: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    date: { type: Number, required: true },
    author: { type: String, required: true },
    journal: { type: String, required: true },
    volume: { type: String, required: true },
    page: { type: String, required: true },
    issue: { type: String, required: true },
    doi: { type: String, required: true },
    type: { type: String, required: true },
    scopus: { type: String, required: true },
    wos: { type: String, required: true },
    ugc: { type: String, required: true },
    crossref: { type: Number, required: true },
    scopuscitation: { type: Number, required: true },
    access: { type: Number, required: true },
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }

});

module.exports = mongoose.model('Publication', publicationSchema);

