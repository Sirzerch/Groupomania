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