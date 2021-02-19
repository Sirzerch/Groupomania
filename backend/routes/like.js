//Initialisation du touter
const express = require('express');
const router = express.Router();

//Imports du code métier
const likeCtrl = require('../controllers/like');

//Routes 
router.post('/messages/:messageId/like', likeCtrl.like);
router.post('/messages/:messageId/dislike', likeCtrl.disLiked);

module.exports = router;