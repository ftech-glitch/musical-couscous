require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./src/db/db");
const path = require("path");

const authRoutes = require("./src/routers/auth");
const playlistRoutes = require("./src/routers/playlists");
const albumRoutes = require("./src/routers/albums");
const songRoutes = require("./src/routers/songs");
const searchRoutes = require("./src/routers/search");
const favoriteRoutes = require("./src/routers/favorite");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/audio", express.static(path.join(__dirname, "./public/audio")));
app.use("/albums", express.static(path.join(__dirname, "./public/albums")));
app.use(
  "/playlists",
  express.static(path.join(__dirname, "./public/playlists"))
);

app.use("/auth", authRoutes);
app.use("/playlist", playlistRoutes);
app.use("/album", albumRoutes);
app.use("/song", songRoutes);
app.use("/search", searchRoutes);
app.use("/favorite", favoriteRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started on port ${port}...`));
