import React, { useEffect, useRef, useState, useContext } from "react";
import Book from "./Book";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const BooksDisplay = () => {
  const userCtx = useContext(UserContext);
  const [books, setBooks] = useState([]);
  const fetchData = useFetch();

  const titleRef = useRef();
  const authorRef = useRef();
  const yearRef = useRef();

  const getBooks = async () => {
    const res = await fetchData(
      "/api/books",
      undefined,
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setBooks(res.data);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  const addBook = async () => {
    const res = await fetchData(
      "/api/books",
      "PUT",
      {
        title: titleRef.current.value,
        author: authorRef.current.value,
        year: yearRef.current.value,
      },
      userCtx.accessToken
    );

    if (res.ok) {
      getBooks();
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  const deleteBook = async (id) => {
    const res = await fetchData(
      "/api/books/" + id,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      getBooks();
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  return (
    <div className="container">
      <div className="row">
        <h1 className="col-md-6">Book List</h1>
      </div>

      {userCtx.role === "admin" ? (
        <div className="row">
          <input
            type="text"
            ref={titleRef}
            placeholder="title"
            className="col-md-3"
          />
          <input
            type="text"
            ref={authorRef}
            placeholder="author"
            className="col-md-3"
          />
          <input
            type="text"
            ref={yearRef}
            placeholder="year published"
            className="col-md-3"
          />
          <button className="col-md-3" onClick={addBook}>
            add
          </button>
        </div>
      ) : (
        ""
      )}

      <br />
      <br />

      <div className="row">
        <div className="col-md-3">Title</div>
        <div className="col-md-3">Author</div>
        <div className="col-md-2">Year Published</div>
        <div className="col-md-2"></div>
        <div className="col-md-2"></div>
      </div>

      {books.map((item) => {
        return (
          <Book
            key={item._id}
            id={item._id}
            title={item.title}
            author={item.author}
            yearPublished={item.year_published}
            deleteBook={deleteBook}
            getBooks={getBooks}
          />
        );
      })}
    </div>
  );
};

export default BooksDisplay;
