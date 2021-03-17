const express = require("express");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const { RSA_NO_PADDING } = require("constants");

// Conserve le fichier index en mémoire pour limiter les I/O.
const indexPath = path.resolve(__dirname, "static_files", "index.html");
const indexPromise = fs.promises.readFile(indexPath, "utf-8");

const app = express();

// supprimer un header qui donne trop d'informations
app.disable("x-powered-by");
// active la compression
app.use(compression());

// expose l'application web statique
app.use(express.static("static_files"));

// La route vers les 404, à déclarer en dernier, elle renvoie le contenu du fichier index.html
app.get("*", (req, res) => {
  indexPromise.then((file) => {
    res.send(file);
  });
});

// démarre l'écoute du serveur sur le port 4000
const instance = app.listen(4000, () => {
  console.log("application started");
  // handle properly CTRL+C
  process.on("SIGINT", () => {
    instance.close(() => console.log("application ended"));
  });
});
