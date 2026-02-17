import express from "express";
import Book from "../models/book.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, userId: req.userId});

        if (!book){
            return res.status(404).json({ message: "Book not found" })
        }
    
        res.status(200).json(book);

    } catch (error) {
        res.status(500).json({ message: "Error fetching book", error: error.message});
    }
});

router.get("/", async (req, res) => {
    const { genre } = req.query

    const filter = { userId: req.userId };
    if(genre) filter.genre = genre;

    console.log("backend genre:", genre);

    try {
        const books = await Book.find(filter).sort({ createdAt: -1 });

        if (!books){
            return res.status(404).json({ message: "Books not found" })
        }
    
    res.status(200).json({ count: books.length, books});

    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message});
    }
});

router.post("/", async (req, res) => {
    try {
        const newBook = await Book.create({ ...req.body, userId: req.userId});

        if (!newBook){
            return res.status(400).json({ message: "new Book not created" });
        }

        res.status(201).json(newBook);

    } catch (error) {
        res.status(500).json({ message: "Error creating new Book", error: error.message});
    }
});

router.patch("/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, req.body, { returnDocument: 'after' });

        if (!updatedBook){
            return res.status(404).json({ message: "Book not updated" });
        }

        res.status(200).json(updatedBook);

    } catch (error) {
        res.status(500).json({ message: "Error updating Book", error: error.message});
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const newBook = await Book.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!newBook){
            return res.status(404).json({ message: "new Book not deleted" })
        }
    
        res.status(200).json(newBook);

    } catch (error) {
        res.status(500).json({ message: "Error deleting new Book", error: error.message});
    }
});

export default router;