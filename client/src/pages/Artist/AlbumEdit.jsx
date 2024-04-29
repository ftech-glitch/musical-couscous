import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";

const AlbumEdit = () => {
  const { album_id } = useParams();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Fetch album details
  const fetchAlbumDetails = async () => {
    const res = await fetchData(
      `/album/${album_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      const data = res.data.data; // set default data to present
      setAlbum(data);
      setTitle(data.title);
      setContent(data.content || "");
    } else {
      setErrorMessage("Error fetching album details");
    }
  };

  useEffect(() => {
    fetchAlbumDetails(); //
  }, [album_id]);

  const handleCoverChange = (e) => {
    setCover(e.target.files[0]); // Store the selected cover image
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (cover) {
      formData.append("cover", cover); // Add cover if changed
    }

    try {
      const res = await fetchData(
        `/album/${album_id}/${userCtx.artist_id}`,
        "PUT",
        formData,
        userCtx.accessToken
      );

      if (res.ok) {
        navigate(-1);
      } else {
        setErrorMessage("Error updating album");
      }
    } catch (error) {
      setErrorMessage("Error updating album");
    }
  };

  if (!album) {
    return <div>Loading album details...</div>;
  }

  return (
    <div>
      <h2>Edit Album</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleUpdateAlbum}>
        <MDBInput
          wrapperClass="mb-4"
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <MDBInput
          wrapperClass="mb-4"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div>
          <label>Change Album Cover:</label>
          <input type="file" onChange={handleCoverChange} />
        </div>
        <MDBBtn type="submit">Update Album</MDBBtn>
      </form>
    </div>
  );
};

export default AlbumEdit;
