const Joueur = require('../modele/old/joueur');
const Partie = require('../modele/old/partie');

// Add new player
exports.newJoueur = async (req, res) => {
    try {
        const joueur = new Joueur({
            pseudo: req.body.pseudo,
            nom: req.body.nom,
            sante: 100,
            score: 0
        });
        const savedJoueur = await joueur.save();
        res.json({ message: `Le joueur a été ajouté avec succès :${savedJoueur.pseudo}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all players
exports.getAllJoueurs = async (req, res) => {
    try {
        const joueurs = await Joueur.find();
        res.json(joueurs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get player by ID
exports.getJoueur = async (req, res) => {
    try {
        const joueur = await Joueur.findById(req.params.id);
        if (!joueur) return res.status(404).json({ message: "Joueur non trouvé" });
        res.json(joueur);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete player
exports.deleteJoueur = async (req, res) => {
    try {
        const joueur = await Joueur.findByIdAndDelete(req.params.id);
        if (!joueur) return res.status(404).json({ message: "Joueur non trouvé" });
        res.json({ message: "Joueur supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Attack function
exports.attaque = async (req, res) => {
    try {
        const attaquant = await Joueur.findById(req.params.attaquantId);
        const victime = await Joueur.findById(req.params.victimeId);

        if (!attaquant || !victime) {
            return res.status(404).json({ message: "Joueur non trouvé" });
        }

        // Update health and score
        victime.sante = Math.max(0, victime.sante - 20);
        attaquant.score += 10;

        await Promise.all([attaquant.save(), victime.save()]);

        res.json({
            message: "Attaque réussie",
            attaquant: attaquant,
            victime: victime
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new game
exports.newPartie = async (req, res) => {
    try {
        const joueur1 = await Joueur.findById(req.params.joueur1Id);
        const joueur2 = await Joueur.findById(req.params.joueur2Id);

        if (!joueur1 || !joueur2) {
            return res.status(404).json({ message: "Joueur non trouvé" });
        }

        const partie = new Partie({
            nom: req.body.nom,
            joueur_1: joueur1._id,
            joueur_2: joueur2._id,
            etat: "en cours"
        });

        const savedPartie = await partie.save();
        res.json(savedPartie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
