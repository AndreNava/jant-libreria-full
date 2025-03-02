import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFound from "./NotFound";

export default function BookDetails({ rentedBooks, setRentedBooks, books }) {
  const { isbn } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [rentIsClicked, setRentIsClicked] = useState(false);
  const [daysOfRent, setDaysOfRent] = useState("5");
  const [successfulRented, setSuccessfulRented] = useState(false);

  useEffect(() => {
    const fetchedBook = books.find((item) => item.isbn === isbn);
    if (fetchedBook) {
      setBook(fetchedBook);
    } else {
      console.error(`No se encontró un libro con ISBN: ${isbn}`);
    }
  }, [isbn, books]);

  useEffect(() => {
    const fetchRentedBooks = async () => {
      try {
        const response = await fetch("https://libreria-backend-rented-production.up.railway.app/order-products");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const formattedData = data.map((item) => ({
          ...item,
          book: item.book || { isbn: item.isbn }, 
        }));

        setRentedBooks(formattedData);
      } catch (error) {
        console.error("Error fetching rented books:", error);
      }
    };

    fetchRentedBooks();
  }, [setRentedBooks]);

  function handleRentedBook() {
    const days = parseInt(daysOfRent, 10);
    const rentedDate = new Date();
    const returnedDate = new Date();
    returnedDate.setDate(rentedDate.getDate() + days);

    const rentedBookData = {
      rentedDate,
      price: book.rentPriceDay * days,
      daysOfRent: days,
      returnedDate,
      book,
    };

    setRentedBooks((prevRentedBooks) => [...prevRentedBooks, rentedBookData]);

    fetch("https://libreria-backend-rented-production.up.railway.app/order-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isbn: book.isbn,
        author: book.author,
        title: book.title,
        description: book.description,
        year: book.year,
        imageUrl: book.imageUrl,
        imageAlt: book.imageAlt,
        rentPriceDay: book.rentPriceDay,
        daysOfRent: days,
        returnedDate: returnedDate,
        price: book.rentPriceDay * days,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al rentar el libro");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Libro rentado con éxito:", data);
        setSuccessfulRented(true);
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        alert("Hubo un problema al rentar el libro. Intenta nuevamente.");
        setRentedBooks((prevRentedBooks) =>
          prevRentedBooks.filter((rented) => rented.book.isbn !== book.isbn)
        );
      })
      .finally(() => {
        setRentIsClicked(false);
      });
  }

  function handleDaysOfRents(event) {
    setDaysOfRent(event.target.value);
  }

  function handleReturn() {
    navigate(-1);
  }

  if (!book) return <NotFound />;

  return (
    <div className="featured-books__detail">
      <div className="featured-books__detail-header">
        <button className="featured-books__detail-btn" onClick={handleReturn}>
          Regresar
        </button>
      </div>
      <h1 className="featured-books__detail-title">{book.title}</h1>
      <h2 className="featured-books__detail-author">Autor: {book.author}</h2>
      <p className="featured-books__detail-year">
        Año de publicación: {book.year}
      </p>
      <div className="featured-books__detail-image">
        <img src={book.imageUrl} alt={book.imageAlt} />
      </div>
      <p className="featured-books__detail-description">{book.description}</p>
      {successfulRented && (
        <p>
          <b>
            Libro alquilado exitosamente, puedes ver tus libros alquilados en el
            menú "Alquilados"
          </b>
        </p>
      )}
      {!rentIsClicked &&
        rentedBooks.some(
          (rented) => rented.book && rented.book.isbn === book.isbn
        ) && (
          <p>
            Ya tienes alquilado este libro actualmente. <br /> No puedes rentar
            el mismo libro 2 veces.
          </p>
        )}
      {!rentIsClicked &&
        !rentedBooks.some(
          (rented) => rented.book && rented.book.isbn === book.isbn
        ) && (
          <button
            className="featured-books__detail-btn"
            onClick={() => setRentIsClicked(true)}
          >
            Rentar
          </button>
        )}
      {rentIsClicked && (
        <div>
          <form>
            <p>
              <b> Deseas rentar por cuantos días naturales: </b>
            </p>
            <label>
              <input
                type="radio"
                name="opciones"
                value={5}
                checked={daysOfRent === "5"}
                onChange={handleDaysOfRents}
              />
              5 días{" "}
            </label>
            <label>
              <input
                type="radio"
                name="opciones"
                value={10}
                checked={daysOfRent === "10"}
                onChange={handleDaysOfRents}
              />
              10 días{" "}
            </label>
            <label>
              <input
                type="radio"
                name="opciones"
                value={15}
                checked={daysOfRent === "15"}
                onChange={handleDaysOfRents}
              />
              15 días{" "}
            </label>
            <p>
              El precio por día de este ejemplar es de{" "}
              <b>${book.rentPriceDay}</b>
            </p>
            <p>
              El precio de la renta es de:{" "}
              <b>${book.rentPriceDay * daysOfRent}</b>
            </p>
          </form>
          <button
            className="featured-books__detail-btn"
            onClick={() => setRentIsClicked(false)}
          >
            Cancelar
          </button>
          <button
            className="featured-books__detail-btn"
            onClick={handleRentedBook}
          >
            Aceptar
          </button>
        </div>
      )}
    </div>
  );
}
