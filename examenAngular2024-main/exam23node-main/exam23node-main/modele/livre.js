const mongoose = require('mongoose');

const livre = new mongoose.Schema({
    	titre :String,
        auteur :String,
        etat :String,
        date_publication : Date,
    	id_bibliotheque :String,    
});

module.exports = mongoose.model('Livre', livre); 