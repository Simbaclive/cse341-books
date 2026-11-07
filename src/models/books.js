// src/models/books.js
import { getDb } from '../db/connect.js';

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');
  const books = await collection.find({}).toArray();

  return books;
};

const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const book = await collection.findOne({ id: bookId });

  return book;
};

const createBook = async (book) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.insertOne(book);

  return book;
};

const updateBook = async (bookId, book) => {
  const db = getDb();
  const collection = db.collection('books');
  await collection.updateOne(
    { id: bookId },
    {
      $set: {
        authorId: book.authorId,
        title: book.title,
        publicationDate: book.publicationDate,
      },
    },
  );

  return collection.findOne({ id: bookId });
};

const deleteBook = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');
  const result = await collection.deleteOne({ id: bookId });

  return result;
};

const authorExists = async (authorId) => {
  const db = getDb();
  const collection = db.collection('authors');
  const count = await collection.countDocuments({ id: authorId }, { limit: 1 });

  return count > 0;
};

export { getAllBooks, getBookById, createBook, updateBook, deleteBook, authorExists };