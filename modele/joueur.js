const mongoose = require('mongoose');

const joueurSchema = new mongoose.Schema({
    pseudo: String,
    sante: Number,
   score: Number,
});

module.exports = mongoose.model('Joueur', joueurSchema); 