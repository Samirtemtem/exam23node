const mongoose = require('mongoose');

const partieSchema = new mongoose.Schema({
    nom :String,
    joueur_1 : String,
    joueur_2 :String,
    etat :String,
});

module.exports = mongoose.model('Partie', partieSchema); 