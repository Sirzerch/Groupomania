// Imports
const jwt = require('jsonwebtoken');

// Initialiser la clé de signature JWT (64)

// Exported function
module.exports = {
    parseAuthorization: (authorisation) => {
        // On verifie si la chaine n'est pas null, si tel est le cas on remplace "Bearer "
        // par une chaine vide pour récupérer le Token.
        return (authorisation != null) ? authorisation.replace('Bearer ','') : null;
    },

    getUserId: (authorisation) => {
        // Récupérer l'ID de l'utilisateur
        // Fixer la variable userId à -1 pour être sûr que la requête ne pointe pas nulle part. 
        let userId = -1;

        // Récupérer le module parseAuthorization dans la variable token
        let token = module.exports.parseAuthorization(authorisation);
        
        if(token!= null){
            try{
                // verifier si le token est valide
                let jwtToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
                if(jwtToken != null)
                    userId = jwtToken.userId;
            } catch(err){

            }
            // Si tout va bien, retourner l'userID
            return userId;
        }
    }
}