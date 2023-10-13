const express = require('express');
const router = express.Router(); 

const userRouter = require('./user');
const bookRouter = require('./book');
const authRouter = require('./auth');
const { isUser } = require('../middlewares/authorization');

router.use('/users', isUser, userRouter);

// Toutes les routes /books réquièrent une authentification
router.use('/books', isUser, bookRouter);
router.use('/auth', authRouter);

module.exports = router;