// src/router.js
import express from 'express';
import { getBooksHandler, getBookByIdHandler } from './controllers/books.js';
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
} from './controllers/authors.js';

const router = express.Router();

router.get('/books', getBooksHandler);
router.get('/books/:id', getBookByIdHandler);

/**
 * @openapi
 * /authors:
 *   get:
 *     summary: Get all authors
 *     tags:
 *       - Authors
 *     responses:
 *       200:
 *         description: A list of authors
 *       500:
 *         description: Unable to retrieve authors
 */
router.get('/authors', getAllAuthors);

/**
 * @openapi
 * /authors/{id}:
 *   get:
 *     summary: Get one author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom author id, such as a1.
 *     responses:
 *       200:
 *         description: The matching author
 *       404:
 *         description: Author not found
 *       500:
 *         description: Unable to retrieve author
 */
router.get('/authors/:id', getAuthorById);

/**
 * @openapi
 * /authors:
 *   post:
 *     summary: Create an author
 *     tags:
 *       - Authors
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *               - birthYear
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *           example:
 *             id: a4
 *             name: Example Author
 *             birthYear: 1980
 *     responses:
 *       201:
 *         description: Author created
 *       400:
 *         description: Missing or invalid fields, or the author id already exists
 *       500:
 *         description: Unable to create author
 */
router.post('/authors', createAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   put:
 *     summary: Update an author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom author id, such as a1.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - birthYear
 *             properties:
 *               name:
 *                 type: string
 *               birthYear:
 *                 type: integer
 *           example:
 *             name: Updated Author
 *             birthYear: 1981
 *     responses:
 *       200:
 *         description: Author updated
 *       400:
 *         description: Missing or invalid fields
 *       404:
 *         description: Author not found
 *       500:
 *         description: Unable to update author
 */
router.put('/authors/:id', updateAuthor);

/**
 * @openapi
 * /authors/{id}:
 *   delete:
 *     summary: Delete an author by id
 *     tags:
 *       - Authors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The custom author id, such as a1.
 *     responses:
 *       204:
 *         description: Author deleted
 *       404:
 *         description: Author not found
 *       409:
 *         description: Author cannot be deleted because they still have books
 *       500:
 *         description: Unable to delete author
 */
router.delete('/authors/:id', deleteAuthor);

export default router;