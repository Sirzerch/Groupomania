//Imports des packages
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

//Imports des routes
const userRoutes = require('./routes/user');

dotenv.config({ path: './config/.env' });
const app = express();

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', userRoutes);

//serveur
app.listen(process.env.PORT, () => {
    console.log(`Lecture sur le port ${process.env.PORT}`)
});