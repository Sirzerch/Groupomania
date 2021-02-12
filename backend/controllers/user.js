//Imports
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models')


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

}

exports.login = (req, res, next) => {
    //Paramètres de requête
    let email = req.body.email;
    let password = req.body.password;

    //Vérification des champs obligatoires
    if (email == null || password == null) {
        return res.status(400).json({ error: 'Champs null' });
    }

    models.User.findOne({
        where: {email: email}
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

}