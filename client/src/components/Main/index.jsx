import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import 'remixicon/fonts/remixicon.css';
import AddBookForm from "./AddBookForm";
import EditBookForm from "./EditBookForm";
import FavoriteButton from "./FavoriteBook";

const Main = () => {
  const [books, setBooks] = useState([]); // Масив книг
  const [showForm, setShowForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // Для підтвердження видалення
  const [bookToEdit, setBookToEdit] = useState(null); // Стан для книги, яку редагуємо
  const [favorites, setFavorites] = useState([]);

  const handleEditBook = (id) => {
    const bookToEdit = books.find(book => book.id === id); // Знаходимо книгу за ID
    setBookToEdit(bookToEdit); // Оновлюємо стан для редагування
    setShowForm(true); // Показуємо форму редагування
  };

  const handleSaveBook = (updatedBook) => {
    updateBook(updatedBook); // Оновлюємо книгу через PUT запит
    setShowForm(false); // Закриваємо форму після збереження
  };
  
  const updateBook = async (updatedBook) => {
    try {
      const response = await fetch(`http://localhost:8080/api/books/${bookToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });

      if (!response.ok) {
        throw new Error('Помилка при оновленні книги');
      }

      const data = await response.json();

      // Оновлюємо книги в стані з новими даними
      const updatedBooks = books.map(book =>
        book.id === bookToEdit.id ? { ...book, ...updatedBook } : book
      );
      setBooks(updatedBooks); // Оновлюємо список книг
      setBookToEdit(null); // Скидаємо книгу для редагування
    } catch (error) {
      console.error('Помилка при оновленні книги', error);
    }
  };
  
  
  // Отримуємо книги з API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/books');
        if (!response.ok) {
          throw new Error(`Помилка: ${response.statusText}`);
        }
        const data = await response.json();
        setBooks(data); // Оновлюємо список книг
      } catch (error) {
        console.error("Помилка при завантаженні книг", error);
      }
    };
    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleAddBookClick = () => {
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false); // Close the modal when canceling
    setBookToEdit(null); // Reset the book being edited (clear selected ID)
  };
  

  const handleDeleteBook = (bookId) => {
	console.log("ID книги для видалення:", bookId); // Логування ID книги
	setConfirmDelete(bookId); // Підтвердження видалення
  };
  
  const confirmDeleteBook = async () => {
    try {
        console.log("Підтвердження видалення книги з ID:", confirmDelete); // Перевіряємо ID
        const response = await fetch(`http://localhost:8080/api/books/${confirmDelete}`, { // Забрали двокрапку
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error("Помилка при видаленні книги");
        }

        // Оновлюємо список після видалення
        setBooks(books.filter((book) => book.id !== confirmDelete));
        setConfirmDelete(null); // Скидаємо підтвердження
    } catch (error) {
        console.error("Помилка при видаленні книги", error);
    }
};
  
  const cancelDelete = () => {
	console.log("Видалення скасовано");
	setConfirmDelete(null); // Закриваємо модальне вікно
  };
  

  return (
    <div className={styles.main_container}>
      <nav className={styles.navbar}>
        <h1>MyBooks</h1>
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <div className={styles.books_container}>
        <div className={styles.book_card}>
          <div className={styles.add_book_card} onClick={handleAddBookClick}>
            <span className={styles.add_book_text}>Додати книгу</span>
          </div>
        </div>

        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className={styles.book_card}>
              <img src={book.image} alt={book.title} className={styles.book_image} />
              <h3 className={styles.book_title}>{book.title}</h3>
              <p className={styles.book_descr}>{book.description}</p>
              <div className={styles.icons}>
			  <FavoriteButton bookId={book.id} />

			  	<a href="#" onClick={(e) => {
				e.preventDefault();
				handleEditBook(book.id);
				}}>
					<i className="ri-pencil-line"></i>
				</a>

                <a href="#" onClick={(e) => { 
                  e.preventDefault();
                  handleDeleteBook(book.id); 
                }}>
                  <i className="ri-delete-bin-6-line"></i>
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>Немає книг для відображення</p>
        )}
      </div>
		
      {/* Модальне вікно для додавання книги */}
	  {showForm && (
		<div className={styles.modal_overlay}>
			<div className={styles.modal_content}>
			<AddBookForm 
				onSave={updateBook}
				onCancel={handleCancel}
				book={bookToEdit} // Передаємо книгу для редагування
			/>
			</div>
		</div>
		)}

		{confirmDelete !== null && (
		<div className={styles.modal_overlay}>
			<div className={styles.modal_content}>
			<p>Ви дійсно хочете видалити цю книгу?</p>
			<div className={styles.form_buttons}>
				<button onClick={confirmDeleteBook} className={styles.save_button}>
				Так, видалити
				</button>
				<button onClick={cancelDelete} className={styles.cancel_button}>
				Відмінити
				</button>
			</div>
			</div>
		</div>
		)}
		{/* Форма редагування книги */}
		{showForm && bookToEdit && (
				<div className={styles.modal_overlay}>
				<div className={styles.modal_content}>
					<EditBookForm
					book={bookToEdit} // Передаємо книгу для редагування
					onSave={handleSaveBook} // Передаємо метод збереження
					onCancel={handleCancel} // Передаємо метод скасування
					/>
				</div>
				</div>
			)}
    </div>
  );
};

export default Main;
