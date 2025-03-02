import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Books from "./components/Books";
import Search from "./components/Search";
import Rentals from "./components/Rentals";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import BookDetails from "./components/BookDetails";
import { BOOKSDATA } from "./booksData";
import Contact from "./components/Contact";

const App = () => {
  const [rentedBooks, setRentedBooks] = useState([]);

  const [books, setBooks] = useState([]); //Almacenar libros

  // Llamada a la API para obtener los libros
  useEffect(() => {
  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setBooks(data); 
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  fetchBooks();
}, []);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/books"
          element={
            <Books rentedBooks={rentedBooks} setRentedBooks={setRentedBooks} books={books} />
          }
        />
         <Route path="/book/:isbn" element={<BookDetails rentedBooks={rentedBooks} setRentedBooks={setRentedBooks} books={books}/>} />
        <Route path="/search" element={<Search rentedBooks={rentedBooks} setRentedBooks={setRentedBooks} books={books}/>} />
        <Route
          path="/rentals"
          element={
            <Rentals
              rentedBooks={rentedBooks}
              setRentedBooks={setRentedBooks}
            />
          }
        />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
