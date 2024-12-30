const express = require("express");
const http = require("http");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnection = require("./config/mongoconnection.json");
const { add } = require("./controller/chatController");
var path = require("path");
const Partie = require("./modele/partie");
const Joueur = require("./modele/joueur");

mongo
  .connect(mongoconnection.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DataBase Connected");
  })
  .catch((err) => {
    console.log(err);
  });


var app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "twig");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// gestion des routes
const UserRouter = require("./routes/users");
app.use("/user", UserRouter);


//creation du serveur
const server = http.createServer(app);

// Partie Socket
const io = require("socket.io")(server);

io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('creerPartie', async (data) => {
      try {
          const partie = new Partie();
          partie.joueur_1 = data.joueur_1;
          partie.joueur_2 = data.joueur_2;
          partie.etat = "en cours";
          partie.nom = data.nom;
          await partie.save();
          
          socket.emit('partieCreee', partie);
      } catch (error) {
          socket.emit('erreurCreationPartie', error.message);
      }
  });
  socket.on('Afficherstat', async (data) => {
    try {
        const partie = await Partie.findOne({nom: data.nom});
        const joueur_1 = await Joueur.findById(data.joueur_1.replace('v', ''));
        const joueur_2 = await Joueur.findById(data.joueur_2.replace('v', ''));

        socket.emit('statAffiche', {partie, joueur_1, joueur_2});
    } catch (error) {
        socket.emit('erreurCreationPartie', error.message);
    }
});
});
//Lancement du serveur
server.listen(3000, () => console.log("server is run"));
