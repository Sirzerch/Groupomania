//Initialisation du router
const express = require('express');
const router = express.Router();

//Import du code métier
const userCtrl = require('../controllers/user');

//Routes
router.post('/users/register', userCtrl.register);
router.post('/users/login', userCtrl.login);
router.get('/users/me', userCtrl.getUserProfile);
router.put('/users/me', userCtrl.updateUserProfile);

module.exports = router;