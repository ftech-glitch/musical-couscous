const pool = require("../db/db");

const searchHandler = async (req, res) => {
  const search = req.query.search;

  try {
    if (search) {
      const songsQuery = `
        SELECT * FROM songs 
        WHERE title ILIKE $1 
        OR artist ILIKE $1
        LIMIT 50
      `;

      const playlistsQuery = `
        SELECT * FROM playlists 
        WHERE title ILIKE $1 
        LIMIT 50
      `;

      const songs = await pool.query(songsQuery, [`%${search}%`]);
      const playlists = await pool.query(playlistsQuery, [`%${search}%`]);

      const result = {
        songs: songs.rows,
        playlists: playlists.rows,
      };

      res.status(200).json(result);
    } else {
      res.status(200).json({ songs: [], playlists: [] });
    }
  } catch (error) {
    console.error("Error executing search query:", error.message);
    res.status(500).json({ message: "Error executing search query" });
  }
};

module.exports = {
  searchHandler,
};
