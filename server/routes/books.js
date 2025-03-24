const express = require("express");
const router = express.Router();
const book = require("../models/book"); 

// Додати нову книгу
router.post("/add", async (req, res) => {
    const { title, description, image} = req.body;

    try {
        if (!title || !description || !image) {
            return res.status(400).json({ message: "Заповніть всі поля" });
        }

        const newBook = new book({
            title,
            description,
            image,
        });

        await newBook.save(); 
        res.status(201).json({ message: "Книга додана!", book: newBook });
    } catch (error) {
        console.error("Помилка при додаванні книги:", error);
        res.status(500).json({ message: "Помилка сервера", error });
    }
});

// Отримати всі книги
router.get("/", async (req, res) => {
    try {
        const books = await book.find(); 
        res.json(books);
    } catch (error) {
        console.error("Помилка при отриманні книг:", error);
        res.status(500).json({ message: "Помилка при отриманні книг", error });
    }
});

// Видалити книгу за ID
router.delete("/:id", async (req, res) => {
    const { id } = req.params;  // Отримуємо ID з параметра

    try {
        const deletedBook = await book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ message: "Книга не знайдена" });
        }

        res.status(200).json({ message: "Книга успішно видалена", book: deletedBook });
    } catch (error) {
        console.error("Помилка при видаленні книги:", error);
        res.status(500).json({ message: "Помилка сервера", error });
    }
});

// Оновити книгу за ID
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, image } = req.body;
  
    try {
      const updatedBook = await book.findByIdAndUpdate(
        id,
        { title, description, image },
        { new: true }
      );
  
      if (!updatedBook) {
        return res.status(404).json({ message: "Книга не знайдена" });
      }
  
      res.status(200).json({ message: "Книга успішно оновлена", book: updatedBook });
    } catch (error) {
      console.error("Помилка при оновленні книги:", error);
      res.status(500).json({ message: "Помилка сервера", error });
    }
  });  

router.post('/users/:userId/favorites', async (req, res) => {
    const { userId } = req.params;
    const { bookId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Користувач не знайдений' });

        // Додаємо ID книги, якщо її ще немає в списку
        if (!user.favorites.includes(bookId)) {
            user.favorites.push(bookId);
            await user.save();
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося додати в обране' });
    }
});

router.delete('/users/:userId/favorites/:bookId', async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Користувач не знайдений' });

        // Видаляємо ID книги зі списку
        user.favorites = user.favorites.filter(id => id.toString() !== bookId);
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося видалити з обраного' });
    }
});

router.get('/users/:userId/favorites', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('favorites');
        if (!user) return res.status(404).json({ error: 'Користувач не знайдений' });

        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати список обраних книг' });
    }
});


module.exports = router;
