# Books API Week 02 Spec - Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

    {
      "id": "b4",
      "authorId": "a1",
      "title": "Example Book Title",
      "publicationDate": "2026-01-15"
    }

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

    {
      "authorId": "a2",
      "title": "Updated Book Title",
      "publicationDate": "2026-02-20"
    }

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.
## Feature 2: Author CRUD Operations

### Goal
Add an `authors` collection and provide all CRUD operations for authors. Authors are referenced by books through the book `authorId` field. Every author route must be documented and testable in Swagger.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required
- `birthYear`: number, required

Authors will use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Books
Books reference authors through the book `authorId` field. An author cannot be deleted while any book still references that author's `id`.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /authors/:id
Purpose: Return one author by their custom id.

Success:
- Status code: `200`
- Response body: the matching author object

Errors:
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### POST /authors
Purpose: Create a new author.

Request body:

    {
      "id": "a4",
      "name": "Example Author",
      "birthYear": 1980
    }

Success:
- Status code: `201`
- Response body: the newly created author object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `500` if an unexpected server or database error occurs

#### PUT /authors/:id
Purpose: Update an existing author.

Request body:

    {
      "name": "Updated Author",
      "birthYear": 1981
    }

Success:
- Status code: `200`
- Response body: the updated author object

Errors:
- `400` if a required field is missing
- `404` if no author exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /authors/:id
Purpose: Delete an existing author.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no author exists with that id
- `409` if the author still has books
- `500` if an unexpected server or database error occurs

Error response body example for `409`:

    {
      "message": "Author cannot be deleted because they still have books."
    }

### Swagger Documentation
Swagger must document every author route.

### Deployment Expectations
After implementation, the author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

## Version 2 Additions (apply to both books and authors)

### Validation Rules
- `id` and `authorId` must be non-empty strings. If a request body contains an id that is not a string (for example an object or a number), return `400`.
- `title` and `name` must be non-empty strings after trimming whitespace.
- `birthYear` must be a whole number that is not in the future.
- `publicationDate` must be a string in `YYYY-MM-DD` format (ISO 8601 date).
- Only the fields in the data model are saved. Any extra fields in the request body are ignored.
- On PUT, the `id` in the URL is used. Any `id` in the request body is ignored, so an id can never be changed.

### Order of Checks
Every route checks in this order and stops at the first problem:
1. Validate the request body: `400`
2. For routes with `:id`, check that the item exists: `404`
3. Check the relationship and uniqueness rules:
   - A book's `authorId` must match an existing author: `400`
   - A new `id` must not already exist: `400`
   - An author with books cannot be deleted: `409`
4. Any unexpected error: `500`

### Responses
- Error responses always use the format `{ "message": "..." }`.
- Error responses never include stack traces or raw database errors.
- Successful responses may include MongoDB's `_id`. Clients should use the custom `id`.

### Database Notes
- Existing Week 01 book documents that use an `author` (name) field are updated to use `authorId`, and the `author` field is removed.
- Create a unique index on `id` in both the `books` and `authors` collections so duplicate ids are rejected even if two requests arrive at the same time. A duplicate-key error from the database returns `400`.
- Create an index on `books.authorId` so checking whether an author has books is fast.

### Out of Scope for Week 2
- Authentication and authorization. These routes are open to anyone. Authentication is added in a later week.
- Pagination. `GET /books` and `GET /authors` return all documents.