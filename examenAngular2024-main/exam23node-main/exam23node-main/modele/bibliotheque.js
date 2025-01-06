const mongoose = require('mongoose');

const bibliotheque = new mongoose.Schema({
    	nom :String,
    	nbr_livre :Number,
    	adresse :String
    
});

module.exports = mongoose.model('Bibliotheque', bibliotheque); 