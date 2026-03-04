# MongoDB Shell Commands - Assignment 8

This document provides the MongoDB Shell version of all operations implemented in the backend assignment.

## 1. Collection Initialization & Configuration

### Initialize `books` Collection with Schema Validation

```javascript
db.createCollection("books", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required",
        },
      },
    },
  },
});
```

### Initialize `logs` Capped Collection

```javascript
db.createCollection("logs", {
  capped: true,
  size: 1048576, // 1MB
  max: 1000, // Max 1000 documents
});
```

### Create Index on Title

```javascript
db.books.createIndex({ title: 1 });
```

---

## 2. CRUD Operations

### Insert a Single Book

```javascript
db.books.insertOne({
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  year: 1925,
  genres: ["Classic", "Novel"],
});
```

### Insert Batch Entries (Multiple Books)

```javascript
db.books.insertMany([
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    genres: ["Fiction", "Classic"],
  },
  {
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genres: ["Dystopian", "Political Fiction"],
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    genres: ["Fantasy", "Adventure"],
  },
]);
```

### Update Publication Year by Title

```javascript
db.books.updateOne({ title: "The Great Gatsby" }, { $set: { year: 2022 } });
```

### Delete Books Older Than 1950

```javascript
db.books.deleteMany({ year: { $lt: 1950 } });
```

---

## 3. Query & Filter Operations

### Fetch Book by Title

```javascript
db.books.findOne({ title: "1984" });
```

### Filter Books by Year Range (e.g., 1900 to 2000)

```javascript
db.books.find({
  year: { $gte: 1900, $lte: 2000 },
});
```

### Filter Books by Genre

```javascript
db.books.find({ genres: "Classic" });
```

### Paginated List (Sort by Year Desc, Skip 2, Limit 3)

```javascript
db.books.find({}).sort({ year: -1 }).skip(2).limit(3);
```

### Filter Documentation with Integer Years

```javascript
db.books.find({ year: { $type: "int" } });
```

### Exclude Specific Genres (Horror & Science Fiction)

```javascript
db.books.find({
  genres: { $nin: ["Horror", "Science Fiction"] },
});
```

---

## 4. Aggregation Framework

### Match Recent Books (> 2000) and Sort

```javascript
db.books.aggregate([
  { $match: { year: { $gt: 2000 } } },
  { $sort: { year: -1 } },
]);
```

### Projected Stats (Title, Author, Year only)

```javascript
db.books.aggregate([
  { $match: { year: { $gt: 2000 } } },
  { $project: { title: 1, author: 1, year: 1, _id: 0 } },
]);
```

### Unwind Genres

```javascript
db.books.aggregate([{ $unwind: "$genres" }]);
```

### Lookup Logs (Join Books with Logs)

```javascript
db.books.aggregate([
  {
    $lookup: {
      from: "logs",
      localField: "_id",
      foreignField: "bookId",
      as: "bookLogs",
    },
  },
]);
```

---

## 5. Author Operations

### Add Author Entry

```javascript
db.authors.insertOne({
  name: "George Orwell",
  nationality: "British",
  birthYear: 1903,
});
```
