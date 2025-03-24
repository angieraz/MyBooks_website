const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
});

// Додаємо метод для перетворення _id в id
bookSchema.methods.toJSON = function() {
    const book = this.toObject();
    book.id = book._id;
    delete book._id;  // Видаляємо _id, якщо не хочемо, щоб воно поверталося
    return book;
};

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
