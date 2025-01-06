const express = require("express");
const http = require("http");
const mongo = require("mongoose");
const bodyParser = require("body-parser");
const mongoconnection = require("./config/mongoconnection.json");
var path = require("path");
const livre = require("./modele/livre");
const Bibliotheque = require("./modele/bibliotheque");

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
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoutes = require("./routes/users");
const livreRoutes = require("./routes/livre");
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'examen.html'));
});
app.use("/bibliotheque", userRoutes);
app.use("/livre",livreRoutes);


const server = http.createServer(app);

// Partie Socket
const io = require("socket.io")(server);

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('getLivresnonloues', () => {
    livre.find({ etat: "disponible" }).then((livres) => {
      socket.emit('livresnonloues', livres);
    });
  });
  let livres = async () => await livre.find({ etat: "disponible" });
  setInterval(() => {
    socket.emit("getLivresnonloues");
    socket.on("livresnonloues", (l) => {
      if (livres().length > l.length) {
        socket.emit("notificationlocation", "Un nouveau livre est loué");
      }
    });

  }, 5000);
  socket.on('LouerLivre', (data) => {
    livre.findById(data.idlivre).then( async (livre) => {
      livre.etat = "loué";
      let biblio = await Bibliotheque.findById(livre.id_bibliotheque);
      console.log(biblio);
      console.log(livre);
      biblio.nbr_livre--;
      biblio.save();
      livre.save();
    });
  });
  socket.on('nouvelle_partie', (data) => {
    socket.emit('partie_creee', data);
  });

  socket.on('afficher_stats', (data) => {
    socket.emit('stats_joueurs', data);
  });
});

//Lancement du serveur
server.listen(3000, () => console.log("server is running on port 3000"));
