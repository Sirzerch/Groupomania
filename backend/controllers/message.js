//Import
const models = require('../models');
const auth = require('../utils/auth');

//constantes
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;

//Routes
exports.createMessage = (req, res, next) => {
    // Récupération de l'en-tête d'authorisation
    let headerAuth = req.headers['authorization'];

    // Verifier que ce token est valide pour faire une requête en BDD
    let userId = auth.getUserId(headerAuth);

    // Params (recupération du title & du contenue) et de l'image si existante
    let title = req.body.title;
    let content = req.body.content;
    // let image = req.body.image;
    // let attachment = req.body.attachment;
    let mediaUrl = '';

    // if (attachment == 1) {
    //     // Renseigner le chemin du stockage de l'image
    //     mediaUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    // }

    // Verification de données non null & cohérente
    if (title == null || content == null) {
        return res.status(400).json({ error: 'Paramétre invalide' })
    }

    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
        return res.status(400).json({ error: 'Paramétre invalide' })
    }

    // Récupérer l'utilisateur dans la base de données (correspondant au token)
    models.User.findOne({
        where: { id: userId }
    })
        .then((userFound) => {
            // Si l'utilisateur est trouvé, on continue (premier paramètre null)
            if (userFound) {
                models.Message.create({
                    title: title,
                    content: content,
                    // attachment: mediaUrl,
                    like: 0,
                    UserId: userFound.id
                })
                    .then((newMessage) => {
                        if (newMessage) {
                            // Si tout c'est bien passé, le message est crée.
                            return res.status(201).json({ error: 'Message crée !' });
                        } else {
                            return res.status(400).json({ error: 'je sais pas quoi mettre' })
                        }
                    })
                    .catch((err) => {
                        // En d'erreur serveur, un message d'erreur est retourné.
                        return res.status(500).json({ error: 'unable to create message in DB' });
                    });
            } else {
                // En cas de problème, un message d'erreur est retourné.
                res.status(404).json({ error: 'Impossible de récupérer l\'utilisateur' });
            }

        })
        .catch((err) => {
            // Sinon, on retourne une erreur
            return res.status(500).json({ error: 'unable to verify user' });
        });

}

exports.listMessage = (req, res, next) => {
    // Récupération des paramètres dans l'Url
    // fields, permet de selectionner les collones a afficher
    // limit & offset, permet de récupérer les messages par ségmentation (pour limiter la qté)
    // Order, sert a sortir les messages via un ordre particulier
    let fields = req.query.fields;
    let limit = parseInt(req.query.limit);
    let offset = parseInt(req.query.offset);
    let order = req.query.order;

    // Récupération de tous les messages via findAll
    models.Message.findAll({
        // Verification des entrées utilisateurs, si vide mettre des données par défaut.
        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,

        // Inclusion de la table User
        include: [{
            model: models.User,
            attributes: ['username']
        }]
    })
        .then((messages) => {
            // Verification non null
            if (messages) {
                // retour des données en json
                res.status(200).json(messages);
            } else {
                res.status(404).json({ error: 'Pas de messages trouvées' });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: 'invalid fields' });
        });
}

exports.putMessage = (req, res, next) => {
    // Récupération de l'en-tête d'authorisation
    let headerAuth = req.headers['authorization'];

    // Verifier que ce token est valide pour faire une requête en BDD
    let userId = auth.getUserId(headerAuth);

    // Params (recupération du title & du contenue) et de l'image si existante
    let messageId = parseInt(req.params.messageId);
    let title = req.body.title;
    let content = req.body.content;
    let image = req.body.image;
    let attachment = req.body.attachment;
    let mediaUrl = "";

    // if (attachment == 1) {
    //     // Renseigner le chemin du stockage de l'image
    //     mediaUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    // }

    // Verification de données non null & cohérente
    if (title == null || content == null) {
        return res.status(400).json({ error: 'invalid parameters' })
    }

    if (title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT) {
        return res.status(400).json({ error: 'invalid parameters' })
    }
    // Récupérer l'utilisateur dans la base de données (correspondant au token)
    // (callback)

    models.User.findOne({
        where: { id: userId }
    })
        .then((userFound) => {
            // Si l'utilisateur est trouvé, on continue (premier paramètre null)
            // Récupération de l'ID du message
            models.Message.findOne({
                where: { id: messageId }
            })
                .then((messageFound) => {
                    // Si trouvé, il est comparé a l'UserId
                    if (messageFound.UserId == userFound.id) {
                        models.Message.findOne({
                            attributes: ['id', 'title', 'content'],
                            where: { id: messageId }
                        })
                            .then((messageId) => {
                                // Si le message est trouvé, procéder a la modification

                                messageId.update({
                                    title: (title ? title : userFound.title),
                                    content: (content ? content : userFound.content),
                                    // attachment: (mediaUrl ? mediaUrl : mediaUrl)
                                })
                                    .then((putMessage) => {
                                        // Si tout c'est bien passé, le message est envoyé.
                                        if (putMessage) {
                                            // post du message OK
                                            return res.status(201).json({ Message: 'Message modifié !' });
                                        } else {
                                            // Le message n'est pas passé.
                                            return res.status(500).json({ error: 'cannot put message' });
                                        }
                                    })
                                    .catch((err) => {
                                        console.log(messageId);
                                        // En cas d'erreur serveur, un message d'erreur est retourné.
                                        return res.status(500).json({ error: 'unable to modify message in DB' });
                                    });
                            })
                            .catch((err) => {
                                // En d'erreur serveur, un message d'erreur est retourné.
                                return res.status(404).json({ error: 'message not found' });
                            });
                    } else {
                        // Sinon, on retourne une erreur d'accès
                        return res.status(403).json({ error: 'this is not your message.' });
                    }
                })
                .catch((err) => {
                    // Sinon, on retourne une erreur serveur
                    return res.status(500).json({ error: 'faillure - ' + err });
                });
        })
        .catch((err) => {
            // Sinon, on retourne une erreur
            return res.status(500).json({ error: 'unable to verify user' });
        });
}

exports.deleteMessage = (req, res, next) => {
    // Récupération de l'en-tête d'authorisation
    let headerAuth = req.headers['authorization'];

    // Verifier que ce token est valide pour faire une requête en BDD
    let userId = auth.getUserId(headerAuth);

    // Récupération des paramètres
    let messageId = parseInt(req.params.messageId);

    // Récupérer l'utilisateur dans la base de données (correspondant au token)
    models.User.findOne({
        where: { id: userId }
    })
        .then((userFound) => {
            // Si l'utilisateur est trouvé, on continue (premier paramètre null)
            // Récupération de l'ID du message
            models.Message.findOne({
                where: { id: messageId }
            })
                .then((messageFound) => {
                    // Si trouvé, il est comparé a l'UserId
                    if (messageFound.UserId == userFound.id) {
                        // S'il y a des likes liée au messages, il seront supprimés.
                        if (messageFound.id == messageId) {
                            models.Like.destroy({
                                where: { messageId: messageId }
                            })
                                .then(() => {
                                    if (messageId) {
                                        models.Message.destroy({
                                            where: { id: messageId }
                                        })
                                            .then((deleteMessage) => {
                                                // Si tout c'est bien passé, un information de réussite est envoyée.
                                                if (deleteMessage) {
                                                    // delete du message OK
                                                    return res.status(201).json({ message: 'message deleted successfully' });
                                                } else {
                                                    // Le message n'est pas présent.
                                                    return res.status(500).json({ error: 'message not found' });
                                                }
                                            })
                                            .catch((err) => {
                                                // En cas de problème, un message d'erreur est retourné.
                                                res.status(500).json({ error: 'unable to delete message in DB' });
                                            });
                                    } else {
                                        // En cas de problème, un message d'erreur est retourné.
                                        res.status(404).json({ error: 'message not found !' });
                                    }
                                })
                                .catch((err) => {
                                    return res.status(500).json({ error: 'unable to remove Likes in DB' });
                                })
                        }
                    } else {
                        // Sinon, on retourne une erreur d'accès
                        return res.status(403).json({ error: 'this is not your message.' });
                    }
                })
                .catch((err) => {
                    // Sinon, on retourne une erreur serveur
                    return res.status(500).json({ error: 'faillure - ' + err });
                });
        })
        .catch((err) => {
            // Sinon, on retourne une erreur
            return res.status(500).json({ error: 'unable to verify user' });
        });
}
