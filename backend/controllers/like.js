//imports
const models = require('../models');
const auth = require('../utils/auth');

//Controllers 
exports.like = (req, res, next) => {
    // Récupération de l'en-tête d'authorisation
    let headerAuth = req.headers['authorization'];

    // Verifier que ce token est valide pour faire une requête en BDD
    let userId = auth.getUserId(headerAuth);

    //Params
    let messageId = parseInt(req.params.messageId);

    // Verifier si l'ID du message est valide
    if (messageId <= 0) {
        return res.status(400).json({ error: 'invalid parameters' });
    }


    // Verifier dans la BDD si le message existe (id du msg)
    models.Message.findOne({
        where: { id: messageId }
    })
        .then((messageFound) => {
            // Si oui, continuer
            if (messageFound) {
                // Récupérer l'objet utilisateur
                models.User.findOne({
                    where: { id: userId }
                })
                    .then((userFound) => {
                        if (userFound) {
                            // rechercher si on trouve une entrée qui corresponds a la fois a l'ID de l'utilisateur qui fait la requête
                            // Ainsi qu'au message concerné
                            models.Like.findOne({
                                where: {
                                    userId: userId,
                                    messageId: messageId
                                }
                            })
                                .then((isUserAlreadyLiked) => {
                                    // S'assurer qu l'utilisateur n'as pas déjà Like le message
                                    if (!isUserAlreadyLiked) {
                                        // Ajouter la relation qui uni le message et l'utilisateur
                                        console.log(isUserAlreadyLiked)
                                        messageFound.addUser(userFound)
                                            .then((alreadyLikeFound) => {
                                                // mise a jour de l'objet (le message), incrémente les likes de 1
                                                messageFound.update({
                                                    likes: messageFound.likes + 1,
                                                })
                                                    .then(() => {
                                                        if (messageFound) {
                                                            // Affichage de la propriété like qui sera incrémenté
                                                            return res.status(201).json(messageFound);
                                                        } else {
                                                            return res.status(500).json({ error: 'cannot update message' });
                                                        }
                                                    })
                                                    .catch(() => {
                                                        res.status(500).json({ error: 'cannot message like counter' });
                                                    });
                                            })
                                            .catch(() => {
                                                return res.status(500).json({ error: 'unable to set user reaction' });
                                            });
                                    } else {
                                        // Retourner un message de conflit (409)
                                        res.status(409).json({ error: 'message already liked' });
                                    }
                                })
                                .catch(() => {
                                    return res.status(500).json({ error: 'unable to verify is user already liked' });
                                });

                        } else {
                            res.status(404).json({ error: 'user not exist' });
                        }
                    })
                    .catch(() => {
                        return res.status(500).json({ error: 'unable to verify user' });
                    });
            } else {
                res.status(404).json({ error: 'post already liked' });
            }
        })
        .catch(() => {
            // Sinon retourner une erreur
            return res.status(500).json({ error: 'unable to verify message' });
        });
}
exports.disLiked = (req, res, next) => {
    // Récupération de l'en-tête d'authorisation
    let headerAuth = req.headers['authorization'];

    // Verifier que ce token est valide pour faire une requête en BDD
    let userId = auth.getUserId(headerAuth);

    //Params
    let messageId = parseInt(req.params.messageId);

    // Verifier si l'ID du message est valide
    if (messageId <= 0) {
        return res.status(400).json({ error: 'Paramétre invalide' });
    }


    // Verifier dans la BDD si le message existe (id du msg)
    models.Message.findOne({
        where: { id: messageId }
    })
        .then((messageFound) => {
            // Si oui, continuer
            if (messageFound) {
                // Récupérer l'objet utilisateur
                models.User.findOne({
                    where: { id: userId }
                })
                    .then((userFound) => {
                        if (userFound) {
                            // rechercher si on trouve une entrée qui corresponds a la fois a l'ID de l'utilisateur qui fait la requête
                            // Ainsi qu'au message concerné
                            models.Like.findOne({
                                where: {
                                    userId: userId,
                                    messageId: messageId
                                }
                            })
                                .then((isUserAlreadyLiked) => {
                                    // S'assurer qu l'utilisateur a déjà Like le message
                                    if (isUserAlreadyLiked) {
                                        // Supprime la relation qui uni le message et l'utilisateur
                                        console.log(isUserAlreadyLiked)
                                        isUserAlreadyLiked.destroy()
                                            .then((alreadyLikeFound) => {
                                                // mise a jour de l'objet (le message), incrémente les likes de 1
                                                messageFound.update({
                                                    likes: messageFound.likes - 1,
                                                })
                                                    .then(() => {
                                                        if (messageFound) {
                                                            // Affichage de la propriété like qui sera incrémenté
                                                            return res.status(201).json(messageFound);
                                                        } else {
                                                            return res.status(500).json({ error: 'Impossible de mettre à jour le message' });
                                                        }
                                                    })
                                                    .catch(() => {
                                                        res.status(500).json({ error: 'cannot message like counter'  });
                                                    });
                                            })
                                            .catch(() => {
                                                return res.status(500).json({ error: 'impossible de définir la réaction de l\'utilisateur' });
                                            });
                                    } else {
                                        // Retourner un message de conflit (409)
                                        res.status(409).json({ error: 'Message déjà mis à jour' });
                                    }
                                })
                                .catch(() => {
                                    return res.status(500).json({ error: 'Impossible de vérifier si l\'utilisateur a déjà aimé' });
                                });

                        } else {
                            res.status(404).json({ error: 'l\'utilisateur n\'existe pas' });
                        }
                    })
                    .catch(() => {
                        return res.status(500).json({ error: 'Impposible de vérifier l\'utilisateur' });
                    });
            } else {
                res.status(404).json({ error: 'Message déjà aimé' });
            }
        })
        .catch(() => {
            // Sinon retourner une erreur
            return res.status(500).json({ error: 'Impossible de vérifier le message' });
        });

}