import React, { useState } from 'react';
import styles from './styles.module.css';

const AddBookForm = ({ onSave, onCancel }) => {
  const [newBook, setNewBook] = useState({
    title: '',
    description: '',
    image: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newBook.title.trim() || !newBook.description.trim() || !newBook.image.trim()) {
      alert('Будь ласка, заповніть всі поля!');
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/books/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook), 
      });

      const data = await response.json();

      if (response.ok) {
        alert('Книга успішно додана!');
        onSave(newBook); 
        window.location.reload();
      } else {
        alert(`Помилка: ${data.message}`);
      }
    } catch (error) {
      alert('Помилка при збереженні книги');
      console.error(error);
    }
  };

  return (
    <div className={styles.add_book_form}>
      <input
        type="text"
        name="title"
        value={newBook.title}
        onChange={handleInputChange}
        placeholder="Назва книги"
        className={styles.input_field}
      />

      <textarea
        name="description"
        value={newBook.description}
        onChange={handleInputChange}
        placeholder="Опис книги"
        className={styles.input_field}
      />

      <input
        type="text"
        name="image"
        value={newBook.image}
        onChange={handleInputChange}
        placeholder="URL фото книги"
        className={styles.input_field}
      />

      <div className={styles.form_buttons}>
        <button type="submit" className={styles.save_button} onClick={handleSubmit}>
          Зберегти
        </button>
        <button className={styles.cancel_button} onClick={onCancel}>
          Відмінити
        </button>
      </div>
    </div>
  );
};

export default AddBookForm;
