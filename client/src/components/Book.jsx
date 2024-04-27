import React, { useState } from "react";
import styles from "./Book.module.css";
import UpdateModal from "./UpdateModal";
import UserContext from "../context/user";
import { useContext } from "react";
const Book = (props) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const userCtx = useContext(UserContext);
  return (
    <>
      {showUpdateModal && (
        <UpdateModal
          id={props.id}
          title={props.title}
          author={props.author}
          yearPublished={props.yearPublished}
          getBooks={props.getBooks}
          setShowUpdateModal={setShowUpdateModal}
        />
      )}
      <div className={`row ${styles.book}`}>
        <div className="col-sm-3">{props.title}</div>
        <div className="col-sm-3">{props.author}</div>
        <div className="col-sm-2">{props.yearPublished}</div>
        {userCtx.role === "admin" ? (
          <>
            <button
              className="col-sm-2"
              onClick={() => props.deleteBook(props.id)}
            >
              delete
            </button>
            <button
              className="col-sm-2"
              onClick={() => setShowUpdateModal(true)}
            >
              update
            </button>
          </>
        ) : (
          <>
            <button className="col-sm-2" disabled>
              delete
            </button>
            <button className="col-sm-2" disabled>
              update
            </button>
          </>
        )}
      </div>
    </>
  );
};
export default Book;
