const pool = require("../db/db");
const { v4: uuidv4 } = require("uuid");

// get all albums
const getAllAlbums = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM albums");
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching albums" });
  }
};

// get album by id
const getAlbumById = async (req, res) => {
  const { id } = req.params;

  try {
    const album = await pool.query("SELECT * FROM albums WHERE album_id = $1", [
      id,
    ]);

    if (album.rowCount === 0) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(200).json({ data: album.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching album" });
  }
};

// create album
const createAlbum = async (req, res) => {
  const { artist_id } = req.params;
  const { title, content } = req.body;
  let cover = null;

  if (req.file) {
    cover = `/uploads/${req.file.filename}`;
  }

  try {
    const result = await pool.query(
      "INSERT INTO albums (album_id, artist_id, title, content, cover) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [uuidv4(), artist_id, title, content, cover]
    );
    res.status(201).json({ data: result.rows[0], message: "Album created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error creating album" });
  }
};

// delete album
const deleteAlbum = async (req, res) => {
  const { album_id, artist_id } = req.params;

  try {
    // check if album belongs to artist
    const album = await pool.query(
      "SELECT * FROM albums WHERE album_id = $1 AND artist_id = $2",
      [album_id, artist_id]
    );

    if (artist.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "Artist doesn't have access to delete!" });
    }

    await pool.query("DELETE FROM albums WHERE artist_id = $1", [album_id]);

    res.status(200).json({ message: "Album deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting album" });
  }
};

// edit album
const editAlbum = async (req, res) => {
  const { album_id, artist_id } = req.params;
  const { title, content, cover } = req.body;

  try {
    // check if album belongs to artist
    const album = await pool.query(
      "SELECT * FROM albums WHERE album_id = $1 AND artist_id = $2",
      [album_id, artist_id]
    );

    if (album.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "Artist doesn't have access to edit!" });
    }

    const result = await pool.query(
      "UPDATE albums SET title = $1, content = $2, cover = $3 WHERE album_id = $4 RETURNING *",
      [title, content, cover, album_id]
    );

    res.status(200).json({ data: result.rows[0], message: "Album updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating album" });
  }
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  deleteAlbum,
  createAlbum,
  editAlbum,
};
