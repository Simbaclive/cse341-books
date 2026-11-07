// src/controllers/authors.js
import {
  getAllAuthors as getAllAuthorsFromDb,
  getAuthorById as getAuthorByIdFromDb,
  createAuthor as createAuthorInDb,
  updateAuthor as updateAuthorInDb,
  deleteAuthor as deleteAuthorFromDb,
  authorHasBooks,
} from '../models/authors.js';

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const isValidBirthYear = (value) =>
  Number.isInteger(value) && value <= new Date().getFullYear();

const invalidFieldsMessage =
  'id and name must be non-empty strings, and birthYear must be a whole number that is not in the future.';

const getAllAuthors = async (req, res) => {
  try {
    const authors = await getAllAuthorsFromDb();
    return res.status(200).json(authors);
  } catch (error) {
    console.error('GET /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve authors.' });
  }
};

const getAuthorById = async (req, res) => {
  try {
    const author = await getAuthorByIdFromDb(req.params.id);

    if (!author) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('GET /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to retrieve author.' });
  }
};

const createAuthor = async (req, res) => {
  try {
    const { id, name, birthYear } = req.body ?? {};

    if (!isNonEmptyString(id) || !isNonEmptyString(name) || !isValidBirthYear(birthYear)) {
      return res.status(400).json({ message: invalidFieldsMessage });
    }

    const existingAuthor = await getAuthorByIdFromDb(id.trim());
    if (existingAuthor) {
      return res.status(400).json({ message: 'Author id already exists.' });
    }

    const createdAuthor = await createAuthorInDb({
      id: id.trim(),
      name: name.trim(),
      birthYear,
    });

    return res.status(201).json(createdAuthor);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Author id already exists.' });
    }

    console.error('POST /authors failed:', error.message);
    return res.status(500).json({ message: 'Unable to create author.' });
  }
};

const updateAuthor = async (req, res) => {
  try {
    const { name, birthYear } = req.body ?? {};

    if (!isNonEmptyString(name) || !isValidBirthYear(birthYear)) {
      return res.status(400).json({
        message: 'name must be a non-empty string, and birthYear must be a whole number that is not in the future.',
      });
    }

    const existingAuthor = await getAuthorByIdFromDb(req.params.id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    const updatedAuthor = await updateAuthorInDb(req.params.id, {
      name: name.trim(),
      birthYear,
    });

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('PUT /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to update author.' });
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const existingAuthor = await getAuthorByIdFromDb(req.params.id);
    if (!existingAuthor) {
      return res.status(404).json({ message: 'Author not found.' });
    }

    if (await authorHasBooks(req.params.id)) {
      return res.status(409).json({
        message: 'Author cannot be deleted because they still have books.',
      });
    }

    await deleteAuthorFromDb(req.params.id);
    return res.status(204).send();
  } catch (error) {
    console.error('DELETE /authors/:id failed:', error.message);
    return res.status(500).json({ message: 'Unable to delete author.' });
  }
};

export { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };