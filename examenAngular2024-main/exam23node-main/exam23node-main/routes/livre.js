var express = require('express');
var router = express.Router();
const bibliotheque = require('../modele/bibliotheque');
const livre = require('../modele/livre');
const validate = require("../middleware/validate");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/create/:id', validate,function(req, res, next) {
  let Livre = new livre(req.params.id);
  Livre.etat = "disponible";
  let Bibliotheque;
  bibliotheque.findById(Livre.id_bibliotheque).then(function(b){
    console.log(b);
    Bibliotheque = b;
    console.log(Bibliotheque);
    Bibliotheque.nbr_livre++;
    Bibliotheque.save();
  });
  Livre.save();
  res.send('La livre est créée avec succès :'+Bibliotheque.adresse);
});
router.put('/location/:id', async function(req, res, next) {
  try {
    const Livre = await livre.findById(req.params.id);
    if (!Livre) {
      return res.status(404).send('Livre non trouvé');
    }

    const b = await bibliotheque.findById(Livre.id_bibliotheque);
    if (!b) {
      return res.status(404).send('Bibliothèque non trouvée');
    }

    if (Livre.etat === "disponible") {
      Livre.etat = "loué";
      b.nbr_livre--;
      await Promise.all([b.save(), Livre.save()]);
      res.send('Livre loué avec succès : ' + Livre.titre);
    } else if (Livre.etat === "loué") {
      res.send('Le livre est déjà loué');
    } else {
      res.status(400).send('État du livre invalide');
    }
  } catch (error) {
    next(error);
  }
});

router.get('/resume', function(req, res, next) {
  bibliotheque.find().then(function(bibliotheques) {
    let stats = [];
    let promises = bibliotheques.map(b => {
      return livre.find({ id_bibliotheque: b._id }).then(livres => {
        let loues = livres.filter(l => l.etat === "loué").length;
        let disponibles = livres.filter(l => l.etat === "disponible").length;
        return {
          nom: b.nom,
          loues: loues,
          disponibles: disponibles
        };
      });
    });

    Promise.all(promises).then(results => {
      res.json(results);
    }).catch(err => {
      res.status(500).send(err);
    });
  });
});

/*
router.get('/list', function(req, res, next) {
  bibliotheque.find().then(function(b){
    res.send(b);
  });
});

router.get('/details/:id', function(req, res, next) {
  bibliotheque.findById(req.params.id).then(function(b){
    res.send(b);
  });
});
router.delete('/delete/:id', function(req, res, next) {
  bibliotheque.findByIdAndDelete(req.params.id).then(function(b){
    res.send('Le biblio est supprimé avec succès :'+b.adresse);
  });
});
router.post('/addNiveau', function(req, res, next) {

  let niveau = new Niveau();
  niveau.id_batiment = req.body.id;
  niveau.etat_construction = false;
  niveau.save();
  res.send('La niveau est créée avec succès :'+niveau.id);
});

*/
/*

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
*/

module.exports = router;
