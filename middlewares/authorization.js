const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET || "ChangeMePlz";
const expiry = process.env.JWT_EXPIRY || "7d";

// Middlewares 

// Verifier si token et verifier si valide
let isUser = (req, res, next) => {
    // On recupere le token
    let token = req.headers.authorization;

    // On verifie si il existe
    if (!token) return next({ status: 401, type: 'Authorization', message: 'Missing authorization token' });

    // Si j'ai un token... 
    if(token) {
        // Retirer le "Bearer "
        token = token.replace('Bearer ', '');

        // Verifie si le token est valide
        jwt.verify(token, secret, (err, decoded) => {
            // Gestion des erreurs 
            if(err) return next({ status: 401, type: 'Authorization', message: 'Invalid or expired token' });
            
            // Si tout va bien, on continue
            // Enregistrer le jwt décodé dans la requete (pour pouvoir le récupérer après)
            req.decoded = decoded;
            next();
        });
    }
};

// Verifier si admin (qu'il est executé APRES la verification isUser)
let isAdmin = (req, res, next) => {
    // Si l'utilisateur n'est pas admin on renvoit une erreur 403
    if(req.decoded.role !== 'admin') return next({ status: 403, type: 'Authorization', message: 'Forbidden' });

    next();
};


// ----------------------------------

let getToken = (user) => {
    // Je crée un token jwt et je le retourne
    return jwt.sign({
        _id: user._id,
        username: user.username,
        role: user.role
    }, secret, { expiresIn: expiry })
};

module.exports = { isUser, isAdmin, getToken };