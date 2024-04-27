import React, { useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const OverLay = (props) => {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const titleRef = useRef("");
  const authorRef = useRef("");
  const yearRef = useRef("");

  const updateBook = async (id) => {
    const res = await fetchData(
      "/api/books/" + id,
      "PATCH",
      {
        title: titleRef.current.value,
        author: authorRef.current.value,
        year: yearRef.current.value,
      },
      userCtx.accessToken
    );

    if (res.ok) {
      props.getBooks();
      props.setShowUpdateModal(false);
    } else {
      alert(JSON.stringify(res.data));
      console.log(res.data);
    }
  };

  useEffect(() => {
    titleRef.current.value = props.title;
    authorRef.current.value = props.author;
    yearRef.current.value = props.yearPublished;
  }, []);

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <br />
        <br />
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Title</div>
          <input ref={titleRef} type="text" className="col-md-3" />
          <div className="col-md-3"></div>
        </div>

        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Author</div>
          <input ref={authorRef} type="text" className="col-md-3" />
          <div className="col-md-3"></div>
        </div>

        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-3">Year Published</div>
          <input ref={yearRef} type="text" className="col-md-3" />
          <div className="col-md-3"></div>
        </div>
        <br />
        <div className="row">
          <div className="col-md-3"></div>
          <button onClick={() => updateBook(props.id)} className="col-md-3">
            update
          </button>
          <button
            onClick={() => props.setShowUpdateModal(false)}
            className="col-md-3"
          >
            cancel
          </button>
          <div className="col-md-3"></div>
        </div>
      </div>
    </div>
  );
};

const UpdateModal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <OverLay
          id={props.id}
          title={props.title}
          author={props.author}
          yearPublished={props.yearPublished}
          setShowUpdateModal={props.setShowUpdateModal}
          getBooks={props.getBooks}
        />,
        document.querySelector("#modal-root")
      )}
    </>
  );
};

export default UpdateModal;
