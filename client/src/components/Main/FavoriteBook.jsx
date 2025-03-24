import { useState, useEffect } from "react";
import 'remixicon/fonts/remixicon.css';

const FavoriteButton = ({ bookId }) => {
    const [favorites, setFavorites] = useState([]);

    // Завантаження збережених обраних книг
    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
        setFavorites(savedFavorites);
    }, []);

    // Додавання / видалення книги в обране
    const handleFavoriteClick = () => {
        let updatedFavorites;
        if (favorites.includes(bookId)) {
            updatedFavorites = favorites.filter(id => id !== bookId);
        } else {
            updatedFavorites = [...favorites, bookId];
        }

        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    return (
        <a href="#" onClick={(e) => {
            e.preventDefault();
            handleFavoriteClick();
        }}>
            <i className={favorites.includes(bookId) ? "ri-heart-fill" : "ri-heart-line"}></i>
        </a>
    );
};

export default FavoriteButton;
