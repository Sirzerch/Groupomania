//Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const auth = require('../utils/auth');

//Constante
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

//Code métier

exports.register = (req, res, next) => {
    //Paramètres de requête
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;
    let bio = req.body.bio;

    //Vérification des champs obligatoires
    if (email == null || username == null || password == null) {
        return res.status(400).json({ error: 'Champs null' });
    }

    if (username.length >= 13 || username.length <= 4) {
        return res.status(400).json({ error: 'Identifiant non valide (5-12 caractéres)' });
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ error: 'Email non valide' });
    }

    if (PASSWORD_REGEX.test(password)) {
        return res.status(400).json({ error: 'Mot de passe non valide' });
    }

    models.User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(password, 10, (error, hash) => {
                    const user = models.User.create({
                        email: email,
                        username: username,
                        password: hash,
                        bio: bio,
                        isAdmin: 0
                    })
                        .then((user) => res.status(201).json({ userId: user.id }))
                        .catch((error) => res.status(400).json({ error }))

                })
            } else {
                return res.status(409).json({ error: 'Utilisateur déjà existant' })
            }
        })
        .catch(() => res.status(500).json({ error: 'Erreur serveur' }));

},

    exports.login = (req, res, next) => {
        //Paramètres de requête
        let email = req.body.email;
        let password = req.body.password;

        //Vérification des champs obligatoires
        if (email == null || password == null) {
            return res.status(400).json({ error: 'Champs null' });
        }

        models.User.findOne({
            where: { email: email }
        })
            .then(user => {
                if (!user) {
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                }
                //Compare le mot de passe envoyer par le frontend avec le mot de passe dans la collection User
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            return res.status(401).json({ error: 'Mot de passe incorrect !' });
                        }
                        res.status(200).json({
                            userId: user.id,
                            //Signe un token avec jsonwebtoken  
                            token: jwt.sign(
                                {
                                    userId: user.id,
                                    isAdmin: user.isAdmin
                                },
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '1h' }
                            )
                        });
                    })
                    .catch(error => res.status(500).json({ error }))
            })
            .catch(error => res.status(500).json({ error }));

    },

    exports.getUserProfile = (req, res, next) => {
        // Récupération de l'en-tête d'authorisation
        let headerAuth = req.headers['authorization'];

        // Verifier que ce token est valide pour faire une requête en BDD
        let userId = auth.getUserId(headerAuth);

        // Vérifier que userId n'est pas négatif (par sécurité)
        if (userId < 0)
            return res.status(400).json({ error: 'Token non valide' });

        // Si tout va bien, on fait un appel ORM(sequelize) pour récupérer les informations de l'utilisateur en BDD
        models.User.findOne({
            attributes: ['id', 'email', 'username', 'bio'],
            where: { id: userId }
        })
            .then((user) => {
                if (user) {
                    res.status(201).json(user);
                } else {
                    res.status(404).json({ error: 'Utilisateur non trouvé' });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: 'Impossible de récupérer l\'utilisateur' });
            });
    }

exports.updateUserProfile = (req, res, next) => {
    // Récupération de l'en-tête d'authorisation
    let headerAuth = req.headers['authorization'];

    // Verifier que ce token est valide pour faire une requête en BDD
    let userId = auth.getUserId(headerAuth);

    //Params
    let bio = req.body.bio;

    // Récupérer l'utilisateur dans la base de données
    models.User.findOne({
        attributes: ['id', 'bio'],
        where: { id: userId }
    })
        .then((userFound) => {
            // Verifier si l'utilisateur est valide
            if (userFound) {
                // Après verification, mise à jour des données concernés
                userFound.update({
                    bio: (bio ? bio : userFound.bio)
                })
                    .then(() => {
                        // Opération reussi
                        if (userFound) {
                            // Mise a jour effectuée
                            return res.status(201).json(userFound);
                        } else {
                            // Une erreur est survenue
                            return res.status(500).json({ error: 'Le profil ne peux pas être mis à jour' });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({ error: 'impossible de mettre à jour l\'utilisateur' });
                    });
            } else {
                // si celui-ci n'existe pas, retourner une erreur
                res.status(404).json({ error: 'L\'Utilisateur n\'a pas été trouvé' });
            }
        })
        .catch((err) => {
            // Sinon envoyer une erreur
            return res.status(500).json({ error: 'Impossible de vérifier l\'utilisateur' });
        });
}


