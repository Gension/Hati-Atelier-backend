const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const Book = require('../models/book');
const asyncErrorHandler = require('../tools/asyncErrorHandler');
const { isUser, isAdmin } = require('../middlewares/authorization');

// Mettre un middleware pour vérifier que l'utilisateur est bien connecté TOUTE LES ROUTES
// router.use(isUser);
// OU
// c.f. écriture alt dans ./index.js

// @route   GET /books/
// @desc    Get all books
// @access  role:user
router.get('/', asyncErrorHandler(async (req, res) => {

    const books = await Book.find({}).populate('userId');
    res.json(books);

}));

// @route   GET /books/:id
// @desc    Get book by id
// @access  role:user
router.get('/:id', asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findById(id);

    // Si je n'ai pas d'utilisateur, je passe un object avec le code erreur dans le next
    if (!book) return next({
        status: 404,
        type: 'Book',
        id
    });

    res.json(book);
}));

// @route   POST /books/
// @desc    Create a new book
// @access  role:admin
router.post('/', isAdmin, asyncErrorHandler(async (req, res, next) => {
    let { title, author, pages, genre, published } = req.body;

    // On récupérera le userId à partir du token décodé 
    // TODO !!!
    const userId = req.decoded._id;

    if (!title) return next({ status: 400, type: 'Book', message: 'Missing title' });

    const book = await Book.create({
        title,
        author,
        pages,
        genre,
        published,
        userId
    });

    await book.save();
    res.json(book);

}));

// @route   PUT /books/:id
// @desc    Update book by id
// @access  role:admin
router.put('/:id', isAdmin, asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    let { title, author, pages, genre, published } = req.body;

    const book = await Book.findByIdAndUpdate(id, { title, author, pages, genre, published });

    // Si je n'ai pas d'utilisateur, je passe un object avec le code erreur dans le next
    if (!book) return next({ status: 404, type: 'Book', });

    res.json(book);

}));

// @route   DELETE /books/:id
// @desc    Delete book by id
// @access  role:admin
router.delete('/:id', isAdmin, asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) return next({ status: 404, type: 'Book', });

    res.json({ message: 'Book deleted' });
}));

module.exports = router;