//Initialisation du router
const express = require('express');
const router = express.Router();

//Import du code métier
const userCtrl = require('../controllers/user');

router.post('/users/register', userCtrl.register);
router.post('/users/login', userCtrl.login);

module.exports = router;