import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const EditBookForm = ({ book, onSave, onCancel }) => {
  const [updatedBook, setUpdatedBook] = useState({
    title: book.title || '',
    description: book.description || '',
    image: book.image || '',
  });

  // Використовуємо useEffect для оновлення стану при зміні пропса `book`
  useEffect(() => {
    setUpdatedBook({
      title: book.title || '',
      description: book.description || '',
      image: book.image || '',
    });
  }, [book]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBook({
      ...updatedBook,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!updatedBook.title.trim() || !updatedBook.description.trim() || !updatedBook.image.trim()) {
      alert('Будь ласка, заповніть всі поля!');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBook),
      });
  
      // Log the response to see what is being returned from the server
      const data = await response.text();  // Read as text first
      console.log('Response:', data);  // Log the response content
  
      if (response.ok) {
        const jsonData = JSON.parse(data);  // Parse as JSON if response is OK
        alert('Інформацію про книгу успішно оновлено!');
        onSave(updatedBook);  // Викликаємо метод збереження для оновлення
      } else {
        alert(`Помилка: ${data}`);  // Show error message from the response body
      }
    } catch (error) {
      alert('Помилка при оновленні книги');
      console.error(error);
    }
  };
  

  return (
    <div className={styles.add_book_form}>
      <input
        type="text"
        name="title"
        value={updatedBook.title}
        onChange={handleInputChange}
        placeholder="Назва книги"
        className={styles.input_field}
      />

      <textarea
        name="description"
        value={updatedBook.description}
        onChange={handleInputChange}
        placeholder="Опис книги"
        className={styles.input_field}
      />

      <input
        type="text"
        name="image"
        value={updatedBook.image}
        onChange={handleInputChange}
        placeholder="URL фото книги"
        className={styles.input_field}
      />

      <div className={styles.form_buttons}>
        <button type="submit" className={styles.save_button} onClick={handleSubmit}>
          Зберегти зміни
        </button>
        <button className={styles.cancel_button} onClick={onCancel}>
          Відмінити
        </button>
      </div>
    </div>
  );
};

export default EditBookForm;
