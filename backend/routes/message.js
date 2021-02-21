//Initialisation du router
const express = require('express');
const router = express.Router();

//Import du code métier 
const messageCtrl = require ('../controllers/message');

//Routes 
router.get('/messages', messageCtrl.listMessage);
router.post('/messages/new', messageCtrl.createMessage);
router.put('/messages/:messageId', messageCtrl.putMessage);
router.delete('/messages/:messageId', messageCtrl.deleteMessage);


module.exports = router;