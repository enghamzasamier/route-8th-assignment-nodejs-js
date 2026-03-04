# API Documentation

This documentation provides an overview of the available endpoints for the **Library Management System** assignment.

## Base URL

The server runs by default on `http://localhost:3000`.

---

## 1. Authors

Endpoints for managing author records.

### Add Author

- **URL:** `/collection/authors/`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "name": "J.K. Rowling",
    "nationality": "British",
    "birthYear": 1965
  }
  ```
- **Description:** Adds a new author entry to the database.

---

## 2. Books

Comprehensive collection of endpoints for book management, filtering, and aggregation.

### Initialize Books Collection

- **URL:** `/collection/books/`
- **Method:** `POST`
- **Description:** Initializes the books collection with JSON schema validation (requires `title`).

### Add Single Book

- **URL:** `/books/`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "title": "Harry Potter and the Philosopher's Stone",
    "author": "J.K. Rowling",
    "year": 1997,
    "genres": ["Fantasy", "Adventure"]
  }
  ```

### Add Batch Books

- **URL:** `/books/batch`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  [
    {
      "title": "Book 1",
      "author": "Author A",
      "year": 2010,
      "genres": ["Drama"]
    },
    {
      "title": "Book 2",
      "author": "Author B",
      "year": 2015,
      "genres": ["Action"]
    }
  ]
  ```

### Create Title Index

- **URL:** `/books/index`
- **Method:** `POST`
- **Description:** Creates an index on the `title` field for faster searching.

### Fetch by Title

- **URL:** `/books/title`
- **Method:** `GET`
- **Query Params:** `title` (e.g., `/books/title?title=The Great Gatsby`)

### Filter by Year Range

- **URL:** `/books/year`
- **Method:** `GET`
- **Query Params:** `from`, `to` (e.g., `/books/year?from=1900&to=2000`)

### Filter by Genre

- **URL:** `/books/genre`
- **Method:** `GET`
- **Query Params:** `genre` (e.g., `/books/genre?genre=Fantasy`)

### Paginated List

- **URL:** `/books/skip-limit`
- **Method:** `GET`
- **Description:** Returns a sorted list (Year DESC) skipping the first 2 and limiting to 3 results.

### Filter Integer Years

- **URL:** `/books/year-integer`
- **Method:** `GET`
- **Description:** Returns books where the `year` field is stored as an integer.

### Exclude Specific Genres

- **URL:** `/books/exclude-genres`
- **Method:** `GET`
- **Description:** Filters out books in 'Horror' or 'Science Fiction'.

### Update Publication Year

- **URL:** `/books/:title`
- **Method:** `PATCH`
- **Description:** Updates the year of the book with the specified title to 2022.

### Prune Old Books

- **URL:** `/books/before-year`
- **Method:** `DELETE`
- **Query Params:** `year` (e.g., `/books/before-year?year=1950`)

---

## 3. Aggregation Pipelines

Advanced data retrieval endpoints.

### Recent Stats

- **URL:** `/books/aggregate1`
- **Method:** `GET`
- **Description:** Returns books published after 2000, sorted by year descending.

### Projected Stats

- **URL:** `/books/aggregate2`
- **Method:** `GET`
- **Description:** Returns books published after 2000, projecting only title, author, and year (id excluded).

### Unwound Genres

- **URL:** `/books/aggregate3`
- **Method:** `GET`
- **Description:** Returns books with the `genres` array unwound.

### Book Logs (Lookup)

- **URL:** `/books/aggregate4`
- **Method:** `GET`
- **Description:** Returns books with their associated logs via a `$lookup` operation.

---

## 4. Logs

System logging endpoints.

### Initialize Capped Logs

- **URL:** `/collection/logs/capped`
- **Method:** `POST`
- **Description:** Creates a capped collection named `logs` (1MB size, max 1000 documents).

### Append Log

- **URL:** `/collection/logs/`
- **Method:** `POST`
- **Body (JSON):**
  ```json
  {
    "bookId": "OBJECT_ID_HERE",
    "action": "viewed",
    "timestamp": "2023-10-27T10:00:00Z"
  }
  ```
