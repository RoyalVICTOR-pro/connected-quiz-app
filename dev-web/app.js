const express = require("express");
const morgan = require("morgan")("dev"); // comme le require retourne une fonction, on lui passe le dev en paramètre de la fonction. 
const bodyParser = require("body-parser");
const config = require("./config");
const mysql = require("promise-mysql");
const {checkAndChange} = require ("./api/functions");

mysql.createConnection({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    port: config.db.port,
    database: config.db.database
}).then((connexion)=>{
    console.log("Connected !");

    const app = express();

    let APIRouter = express.Router();
    let Sessions = require("./api/classes/sessions-class")(connexion,config); // Comme il y a un return, on récupère directement la fonction. + petit trick JS : le fait d'avoir fait une fonction permet de passer des paramètres de cette facon.  

    app.use(morgan);
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    
    // Récupère toutes les sessions
    APIRouter.route("/sessions/list").get(async (requete,resultat) => {
        let allSessions = await Sessions.getAll();
        resultat.json(checkAndChange(allSessions));
    });

    APIRouter.route("/sessions/add").post(async (requete,resultat) => { 
        let newSession = await Sessions.add(requete.body.name, requete.body.quiz);
        resultat.json(checkAndChange(newSession));
    })

    // Définition de la route de l'API
    app.use(config.rootApi, APIRouter);
    
    app.listen(config.port,() => console.log("Started"));


}).catch((err)=>{
    console.log("Error during connexion : " + err.message);
});
