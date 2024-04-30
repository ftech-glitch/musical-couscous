const pool = require("../db/db");
const { v4: uuidv4 } = require("uuid");

// Add an album to user favorites
const addAlbumToUserFavorite = async (req, res) => {
  const { album_id, user_id } = req.params;

  try {
    // Check if the album is already in the artist's favorites
    const checkDuplicate = await pool.query(
      "SELECT * FROM favorites WHERE user_id = $1 AND album_id = $2",
      [user_id, album_id]
    );

    if (checkDuplicate.rowCount > 0) {
      return res
        .status(400)
        .json({ message: "Album is already in favorites." });
    }

    const favorite_id = uuidv4();
    await pool.query(
      "INSERT INTO favorites (favorite_id, user_id, album_id) VALUES ($1, $2, $3)",
      [favorite_id, user_id, album_id]
    );

    res.status(200).json({ message: "Album added to favorites." });
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    res.status(500).json({ message: "Error adding to favorites." });
  }
};

// Add an album to artist favorites
const addAlbumToArtistFavorite = async (req, res) => {
  const { album_id, artist_id } = req.params;

  try {
    // Check if the album is already in the artist's favorites
    const checkDuplicate = await pool.query(
      "SELECT * FROM favorites_artist WHERE artist_id = $1 AND album_id = $2",
      [artist_id, album_id]
    );

    if (checkDuplicate.rowCount > 0) {
      return res
        .status(400)
        .json({ message: "Album is already in favorites." });
    }

    const favorite_id = uuidv4(); // Generate a unique ID
    await pool.query(
      "INSERT INTO favorites_artist (favorite_id, artist_id, album_id) VALUES ($1, $2, $3)",
      [favorite_id, artist_id, album_id]
    );

    res.status(200).json({ message: "Album added to favorites." });
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
    res.status(500).json({ message: "Error adding to favorites." });
  }
};

// Remove an album from user favorites
const removeAlbumFromUserFavorite = async (req, res) => {
  const { album_id, user_id } = req.params;

  try {
    await pool.query(
      "DELETE FROM favorites WHERE user_id = $1 AND album_id = $2",
      [user_id, album_id]
    );

    res.status(200).json({ message: "Album removed from favorites." });
  } catch (error) {
    console.error("Error removing from favorites:", error.message);
    res.status(500).json({ message: "Error removing from favorites." });
  }
};

// Remove an album from artist favorites
const removeAlbumFromArtistFavorite = async (req, res) => {
  const { album_id, artist_id } = req.params;

  try {
    await pool.query(
      "DELETE FROM favorites_artist WHERE artist_id = $1 AND album_id = $2",
      [artist_id, album_id]
    );

    res.status(200).json({ message: "Album removed from favorites." });
  } catch (error) {
    console.error("Error removing from favorites:", error.message);
    res.status(500).json({ message: "Error removing from favorites." });
  }
};

// Get all favorite albums for a user
const getUserFavorite = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT albums.* 
        FROM favorites 
        JOIN albums ON favorites.album_id = albums.album_id 
        WHERE favorites.user_id = $1`,
      [user_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching favorite albums:", error.message);
    res.status(500).json({ message: "Error fetching favorite albums." });
  }
};

// Get all favorite albums for an artist
const getArtistFavorite = async (req, res) => {
  const { artist_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT albums.* 
        FROM favorites_artist 
        JOIN albums ON favorites_artist.album_id = albums.album_id 
        WHERE favorites_artist.artist_id = $1`,
      [artist_id]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching favorite albums:", error.message);
    res.status(500).json({ message: "Error fetching favorite albums." });
  }
};

module.exports = {
  getArtistFavorite,
  getUserFavorite,
  addAlbumToArtistFavorite,
  addAlbumToUserFavorite,
  removeAlbumFromArtistFavorite,
  removeAlbumFromUserFavorite,
};
