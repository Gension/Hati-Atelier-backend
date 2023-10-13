const express = require('express');
const router = express.Router(); 
const bcrypt = require('bcrypt');
const logger = require('../tools/logger'); 
const { User } = require('../models');
const { getToken } = require('../middlewares/authorization');

// @route /auth/register
// @desc Register a new user
// @access Public
router.post('/register', async (req, res) => {
    let { username, password } = req.body;

    if(!username) return next({ status: 400, type: 'User', message: 'Missing username' });
    if(!password) return next({ status: 400, type: 'User', message: 'Missing password' });

    // // je hash le mot de passe pour éviter de le stocker en claire dans la BDD
    password = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password
    });
    
    await user.save();
    res.json(user);
});

// @route /auth/login
// @desc Login a user
// @access Public
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    // Si j'ai un user c'est que le mot de passe est bon
    if(!user) return next({ status: 401, type: 'User', message: 'Invalid credentials' });

    // Je vérifie que le mot de passe est bon
    const validPassword = await bcrypt.compare(password, user.password);
    // Si il est pas bon, je renvoie une erreur
    if(!validPassword) return next({ status: 401, type: 'User', message: 'Invalid credentials' });

    // S'il est bon, je renvoie un token
    const token = getToken(user);
    res.json({ token });
});

module.exports = router;