import React, { useContext, useState, useEffect } from "react";
import Playlists from "./Playlists";
import UserContext from "../../context/user";
import "../Home.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const userCtx = useContext(UserContext);
  // const [favoriteAlbums, setFavoriteAlbums] = useState([]);

  // Fetch user favorite albums
  const fetchFavoriteAlbums = async () => {
    const res = await fetchData(
      `/favorite/user/${userCtx.user_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      setFavoriteAlbums(res.data || []);
    }
  };

  // useEffect(() => {
  //   if (userCtx.isLoggedIn) {
  //     fetchFavoriteAlbums();
  //   }
  // }, [userCtx.isLoggedIn]);

  // Determine the username, defaulting to "Guest" if not logged in
  const username = userCtx.isLoggedIn ? userCtx.username : "Guest";

  // const sliderSettings = {
  //   dots: true,
  //   infinite: false,
  //   speed: 500,
  //   slidesToShow: 4,
  //   slidesToScroll: 2,
  //   arrows: true,
  // };

  return (
    <div className="home-container">
      <h1 className="home-greeting">{`Good Morning, ${username}.`}</h1>
      {userCtx.isLoggedIn && <Playlists />}

      {/* {favoriteAlbums.length > 0 && (
        <>
          <h2>Your Favorite Albums</h2>
          <Slider {...sliderSettings}>
            {favoriteAlbums.map((album) => (
              <div key={album.album_id}>
                <img
                  src={`http://localhost:5001/${album.cover}`}
                  alt={album.title}
                  style={{ maxWidth: "100%", borderRadius: "10px" }}
                />
                <p>{album.title}</p>
              </div>
            ))}
          </Slider>
        </>
      )} */}
    </div>
  );
}

export default Home;
