const express = require('express');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });
const app = express();


//routes
app.use('/api/user', userRoutes);

//server
app.listen(process.env.PORT, () => {
    console.log(`Lecture sur le port ${process.env.PORT}`)
});