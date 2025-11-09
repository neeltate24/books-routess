const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const { initializeDatabase } = require("./db/db.connect");
const Book = require("./models/book.model");

app.use(express.json());

// initialize database
initializeDatabase();

// 1. Create a new book
async function createBook(newBook) {
  try {
    const book = new Book(newBook);
    const savedBook = await book.save();
    console.log("New Book Added:", savedBook);
    return savedBook;
  } catch (error) {
    throw error;
  }
}

app.post("/books", async (req, res) => {
  try {
    const savedBook = await createBook(req.body);
    res.status(201).json({
      message: "Book added successfully",
      book: savedBook,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add book." });
  }
});

// 3. Get all books
async function getAllBooks() {
  try {
    return await Book.find();
  } catch (error) {
    throw error;
  }
}

app.get("/books", async (req, res) => {
  try {
    const books = await getAllBooks();
    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ error: "No books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 4. Get book by title
async function getBookByTitle(title) {
  try {
    return await Book.findOne({ title: title });
  } catch (error) {
    throw error;
  }
}

app.get("/books/title/:title", async (req, res) => {
  try {
    const book = await getBookByTitle(req.params.title);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ error: "Book not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch book." });
  }
});

// 5. Get books by author
async function getBooksByAuthor(authorName) {
  try {
    return await Book.find({ author: authorName });
  } catch (error) {
    throw error;
  }
}

app.get("/books/author/:authorName", async (req, res) => {
  try {
    const books = await getBooksByAuthor(req.params.authorName);
    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ error: "No books found for this author." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 6. Get books by genre "Business"
app.get("/books/genre/business", async (req, res) => {
  try {
    const books = await Book.find({ genre: "Business" });
    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ error: "No business books found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 7. Get books by year
app.get("/books/year/:year", async (req, res) => {
  try {
    const year = Number(req.params.year);

    const books = await Book.find({ publishedYear: year });

    if (books.length !== 0) {
      res.status(200).json(books);
    } else {
      res.status(404).json({ error: `No books found for year ${year}.` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books." });
  }
});

// 8. Update book rating by ID.
async function updateBookRatingById(bookId, dataToUpdate) {
  try {
    return await Book.findByIdAndUpdate(bookId, dataToUpdate, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
}

app.post("/books/:bookId", async (req, res) => {
  try {
    const updatedBook = await updateBookRatingById(req.params.bookId, req.body);

    if (updatedBook) {
      res.status(200).json({
        message: "Book rating updated successfully",
        updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update rating." });
  }
});

// 9. Update book by title using findOneAndUpdate
async function updateBookByTitle(title, dataToUpdate) {
  try {
    return await Book.findOneAndUpdate({ title: title }, dataToUpdate, {
      new: true,
    });
  } catch (error) {
    throw error;
  }
}

app.post("/books/title/:bookTitle", async (req, res) => {
  try {
    const updatedBook = await updateBookByTitle(req.params.bookTitle, req.body);

    if (updatedBook) {
      res.status(200).json({
        message: "Book details updated successfully",
        updatedBook,
      });
    } else {
      res.status(404).json({ error: "Book does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update book." });
  }
});

// 10. Delete book by ID.
async function deleteBook(bookId) {
  try {
    return await Book.findByIdAndDelete(bookId);
  } catch (error) {
    throw error;
  }
}

app.delete("/books/:bookId", async (req, res) => {
  try {
    const deletedBook = await deleteBook(req.params.bookId);

    if (deletedBook) {
      res.status(200).json({ message: "Book deleted successfully." });
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete book." });
  }
});

// Server Start
const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

// Vercel requirement

// module.exports = (req, res) => app(req, res);
