// Me permet définir une variable globale à la racine de mon projet
global.__basedir = __dirname;

// Importation des modules nécessaires
require('dotenv').config(); // Permet de récupérer les variables d'environnement
const mongoose = require('mongoose'); // Permet de gérer les données de la base de données
const express = require('express'); // Serveur web
const logger = require('./tools/logger'); // Permet de gérer les logs

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI); // 

mongoose.connection.on('connected', () => {
    logger.info('App is connected to MongoDB');
});

require('./models');

const app = express();

app.use(express.json());

// J'importe mon routeur global qui contient toutes les routes
const router = require('./routes');
app.use(router);

app.use((err, req, res, next) => {
    if (err.status && err.status === 404) {
        logger.warn(`${err.type} not found with id ${err.id} - From IP : ${req.ip}`)
        res.status(404).send(`${err.type} not found`);
    } else if (err.status && err.status === 400) {
        logger.warn(`${err.type} request not valid : ${err.message} - From IP : ${req.ip}`)
        res.status(400).send(`${err.type} : Invalid request - ${err.message}`);
    } else if (err.status && err.status === 401) { 
        logger.warn(`${err.type} unauthorized request : ${err.message} - From IP : ${req.ip}`)
        res.status(401).send(`${err.type} : Unauthorized request - ${err.message}`);
    } else if (err.status && err.status === 403) {
        logger.warn(`${err.type} forbidden request : ${err.message} - From IP : ${req.ip}`)
        res.status(403).send(`${err.type} : Forbidden request - ${err.message}`);
    }
    else {
        logger.error(err.message);
        res.status(500).send('Something broke!');
    }
});

app.listen(PORT, () => {
    logger.info(`App is running on port ${PORT}`);
});