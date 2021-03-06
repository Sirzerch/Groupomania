//Imports des packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//Imports des routes
const userRoutes = require('./routes/user');
const messageRoutes = require('./routes/message');
const likeRoutes = require('./routes/like');

dotenv.config({ path: './config/.env' });
const app = express();

//Configure et autorise les requêtes Multi-Origin; définit les Headers & les Methodes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', messageRoutes);
app.use('/api', likeRoutes);

//serveur
app.listen(process.env.PORT, () => {
    console.log(`Lecture sur le port ${process.env.PORT}`)
});