const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router(); 
const User = require('../models/user');
const asyncErrorHandler = require('../tools/asyncErrorHandler');

// @route   GET /users/
// @desc    Get all users
// @access  role:user
router.get('/', asyncErrorHandler(async (req, res) => {

    const users = await User.find({});
    res.json(users);
    
}));

// @route   GET /users/:id
// @desc    Get user by id
// @access  role:user
router.get('/:id', asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    // Si je n'ai pas d'utilisateur, je passe un object avec le code erreur dans le next
    if(!user) return next({
        status: 404,
        type: 'User',
        id
    });

    res.json(user);
}));

// @route   POST /users/
// @desc    Create a new user
// @access  role:admin
router.post('/', asyncErrorHandler(async (req, res, next) => {
    let { username, password, role } = req.body;

    if(!username) return next({ status: 400, type: 'User', message: 'Missing username' });
    if(!password) return next({ status: 400, type: 'User', message: 'Missing password' });

    // // je hash le mot de passe pour éviter de le stocker en claire dans la BDD
    password = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        password,
        role
    });
    
    await user.save();
    res.json(user);

}));

// @route   PUT /users/:id
// @desc    Update user by id
// @access  role:admin
router.put('/:id', asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    let { username, password, role } = req.body;

    if(password) password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(id, { username, password, role});
    
    // Si je n'ai pas d'utilisateur, je passe un object avec le code erreur dans le next
    if(!user) return next({ status: 404, type: 'User', });

    res.json(user);

}));

// @route   DELETE /users/:id
// @desc    Delete user by id
// @access  role:admin
router.delete('/:id', asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    
    if(!user) return next({ status: 404, type: 'User', });

    res.json({ message: 'User deleted' });
}));

module.exports = router;