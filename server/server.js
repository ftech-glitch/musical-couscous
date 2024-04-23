require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./src/db/db");

const authRoutes = require("./src/routers/auth");
const playlistRoutes = require("./src/routers/playlists");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/playlist", playlistRoutes);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server started on port ${port}...`));