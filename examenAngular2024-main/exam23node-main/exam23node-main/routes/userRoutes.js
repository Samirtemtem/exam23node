const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Player routes
router.post('/newjoueur', userController.newJoueur);
router.get('/getalljoueur', userController.getAllJoueurs);
router.get('/getjoueur/:id', userController.getJoueur);
router.delete('/deletejoueur/:id', userController.deleteJoueur);
router.put('/attaque/:attaquantId/:victimeId', userController.attaque);
router.post('/newparite/:joueur1Id/:joueur2Id', userController.newPartie);

module.exports = router;
