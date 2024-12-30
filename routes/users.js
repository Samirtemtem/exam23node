var express = require('express');
var router = express.Router();
const Joueur = require('../modele/joueur');
const Partie = require('../modele/partie');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/newjoueur', function(req, res, next) {
 
  const joueur = new Joueur(req.body);
  joueur.score = 0;
  joueur.sante = 100;
  joueur.save();
  res.send('La joueur est créée avec succès :'+joueur.pseudo);
});
router.get('/getAllJoueur', function(req, res, next) {
  Joueur.find().then(function(joueurs){
    res.send(joueurs);
  });
});
router.get('/getjoueur/:id', function(req, res, next) {
  Joueur.findById(req.params.id).then(function(joueur){
    res.send(joueur);
  });
});
router.delete('/deletejoueur/:id', function(req, res, next) {
  Joueur.findByIdAndDelete(req.params.id).then(function(joueur){
    res.send('Le joueur est supprimé avec succès :'+joueur.pseudo);
  });
});
router.put('/attaque/:idAttaquant/:idVictime',async function(req, res, next) {
  const joueurAttaquant = await Joueur.findById(req.params.idAttaquant);
  const joueurVictime = await Joueur.findById(req.params.idVictime)  
  joueurAttaquant.score += 10;
  joueurVictime.sante -= 20;
  joueurAttaquant.save();
  joueurVictime.save();
  res.send("succees");
});
router.post('/partie/:idAttaquant/:idVictime',async function(req, res, next) {
  const partie = new Partie();
  partie.joueur_1 = req.params.idAttaquant;
  partie.joueur_2 = req.params.idVictime;
  partie.etat = "en cours";
  partie.save();
  res.send("succees");
});
router.get('/partie/new', function(req, res, next) {
  res.sendFile('newpartie.html', { root: 'views' });
});


module.exports = router;
