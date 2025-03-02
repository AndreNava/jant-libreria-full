import { useEffect } from "react";
import { useRentExtension } from "../hooks/useRentExtension.jsx";

export default function Rentals({ rentedBooks, setRentedBooks }) {
  const {
    addTimeIsClicked,
    bookClickAddTime,
    daysAdd,
    successfulAdd,
    handleProrrogaBtn,
    handleCancelarBtn,
    handleAceptarBtn,
    handleDaysOfRents,
  } = useRentExtension(setRentedBooks);

  console.log(rentedBooks)

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

  return (
    <>
      {rentedBooks.length === 0 ? (
        <div className="rentals">
          <h1 className="rentals__title">
            No tienes libros alquilados actualmente
          </h1>
        </div>
      ) : (
        <div className="rentals">
          <h1 className="rentals__title">Tus libros alquilados</h1>
          <div className="rentals-books">
            <ul className="rentals-books__list">
              {rentedBooks.map((item) => (
                <li key={item.book.isbn} className="rentals-books__item">
                  <img src={item.imageUrl} alt={item.imageAlt} />
                  <br/>
                  <h3>{item.title}</h3>
                  <p>
                    Autor: {item.author} <br />
                    Días rentados: {item.daysOfRent}
                    <br />
                    Fecha de devolución:{" "}
                    <b>{item.returnedDate.slice(0,10)}</b>
                    <br />
                  </p>
                  <br />
                  {item.daysOfRent >= 30 && (
                    <div>
                      <b>Tienes el plazo máximo de días rentados</b>
                      <br />
                    </div>
                  )}
                  {!addTimeIsClicked && item.daysOfRent < 30 && (
                    <button
                      className="featured-books__detail-btn"
                      onClick={() => handleProrrogaBtn(item.book)}
                    >
                      Prorroga
                    </button>
                  )}
                  {successfulAdd &&
                    bookClickAddTime.isbn === item.book.isbn && (
                      <p>
                        <b>Plazo extendido exitosamente</b>
                      </p>
                    )}
                  {addTimeIsClicked &&
                    bookClickAddTime.isbn === item.book.isbn && (
                      <div>
                        <form>
                          <p>
                            <b> Deseas extender el plazo por cuantos días: </b>
                          </p>
                          <label>
                            <input
                              type="radio"
                              name="opciones"
                              value={5}
                              checked={daysAdd === "5"}
                              onChange={handleDaysOfRents}
                            />
                            5 días{"   "}
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="opciones"
                              value={10}
                              checked={daysAdd === "10"}
                              onChange={handleDaysOfRents}
                            />
                            10 días{"   "}
                          </label>
                          <label>
                            <input
                              type="radio"
                              name="opciones"
                              value={15}
                              checked={daysAdd === "15"}
                              onChange={handleDaysOfRents}
                            />
                            15 días{"   "}
                          </label>
                          <p>
                            El precio por día de este ejemplar es de{" "}
                            <b>${item.rentPriceDay}</b>
                          </p>
                          <p>
                            El precio del plazo extendido es de:{" "}
                            <b>${item.rentPriceDay * daysAdd}</b>
                          </p>
                        </form>
                        <button
                          className="featured-books__detail-btn"
                          onClick={handleCancelarBtn}
                        >
                          Cancelar
                        </button>
                        <button
                          className="featured-books__detail-btn"
                          onClick={() => handleAceptarBtn(item, daysAdd)}
                        >
                          Aceptar
                        </button>
                      </div>
                    )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
