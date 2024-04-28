const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const Joi = require("joi");

// get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT email, user_id FROM users");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Could not fetch users" });
  }
};

// get all artists
const getAllArtists = async (req, res) => {
  try {
    const result = await pool.query("SELECT email, artist_id FROM artists");
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "error", message: "Could not fetch artists" });
  }
};

// edit user
const editUser = async (req, res) => {
  const { user_id } = req.params; // Assume you are passing user_id in the URL
  const { email, username, password } = req.body;

  // Validate the input data using Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8),
  });

  const { error, value } = schema.validate({ email, username, password });
  if (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }

  try {
    let hash = null;
    if (password) {
      // If password is provided, hash it
      hash = await bcrypt.hash(password, 12);
    }

    // Update the user record
    const query = hash
      ? "UPDATE users SET email = $1, username = $2, hash = $3 WHERE user_id = $4 RETURNING *"
      : "UPDATE users SET email = $1, username = $2 WHERE user_id = $3 RETURNING *";

    const values = hash
      ? [email, username, hash, user_id]
      : [email, username, user_id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Error editing user" });
  }
};

// edit artist
const editArtist = async (req, res) => {
  const { artist_id } = req.params; // Assume you are passing artist_id in the URL
  const { email, username, password } = req.body;

  // Validate the input data using Joi
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8),
  });

  const { error, value } = schema.validate({ email, username, password });
  if (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }

  try {
    let hash = null;
    if (password) {
      // If password is provided, hash it
      hash = await bcrypt.hash(password, 12);
    }

    // Update the artist record
    const query = hash
      ? "UPDATE artists SET email = $1, username = $2, hash = $3 WHERE artist_id = $4 RETURNING *"
      : "UPDATE artists SET email = $1, username = $2 WHERE artist_id = $3 RETURNING *";

    const values = hash
      ? [email, username, hash, artist_id]
      : [email, username, artist_id];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Artist not found" });
    }

    res.status(200).json({ status: "success", data: result.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Error editing artist" });
  }
};

// register a new user
const registerUser = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("user", "artist").default("user"),
  });

  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }

  const { email, username, password, role } = value;

  try {
    // Check if the email already exists in either 'users' or 'artists'
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const existingArtist = await pool.query(
      "SELECT * FROM artists WHERE email = $1",
      [email]
    );

    if (existingUser.rowCount > 0 || existingArtist.rowCount > 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Email already exists" });
    }

    // Hash the password
    const hash = await bcrypt.hash(password, 12);

    // Insert into the correct table based on the role
    if (role === "artist") {
      await pool.query(
        "INSERT INTO artists (email, username, hash) VALUES ($1, $2, $3)",
        [email, username, hash]
      );
      res.json({ status: "success", message: "Artist registered" });
    } else {
      await pool.query(
        "INSERT INTO users (email, username, hash) VALUES ($1, $2, $3)",
        [email, username, hash]
      );
      res.json({ status: "success", message: "User registered" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Registration failed" });
  }
};

// const registerUser = async (req, res) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required(),
//     username: Joi.string().min(3).max(30).required(),
//     password: Joi.string().min(8).required(),
//     role: Joi.string().valid("user", "artist").default("user"),
//   });

//   const { error, value } = schema.validate(req.body);
//   if (error) {
//     return res.status(400).json({ status: "error", message: error.message });
//   }

//   const { email, username, password, role } = value;

//   try {
//     // Check if the user already exists
//     const existingUser = await pool.query(
//       "SELECT * FROM users WHERE email = $1",
//       [email]
//     );
//     if (existingUser.rowCount > 0) {
//       return res
//         .status(400)
//         .json({ status: "error", message: "Email already exists" });
//     }

//     // Hash the password
//     const hash = await bcrypt.hash(password, 12);

//     // Insert the new user into the database
//     await pool.query(
//       "INSERT INTO users (email, username, hash, role) VALUES ($1, $2, $3, $4)",
//       [email, username, hash, role]
//     );

//     res.json({ status: "success", message: "User registered" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ status: "error", message: "Registration failed" });
//   }
// };

// log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user in the database
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Compare the password hash
    const isValid = await bcrypt.compare(password, user.hash);
    if (!isValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    // Generate JWT tokens for authentication
    const claims = { email: user.email, role: "user", user_id: user.user_id };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Login failed" });
  }
};

// log in an artist
const loginArtist = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the artist in the database
    const result = await pool.query("SELECT * FROM artists WHERE email = $1", [
      email,
    ]);
    if (result.rowCount === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const artist = result.rows[0];

    // Compare the password hash
    const isValid = await bcrypt.compare(password, artist.hash);
    if (!isValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    // Generate JWT tokens for authentication
    const claims = {
      email: artist.email,
      role: "artist",
      artist_id: artist.artist_id,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Login failed" });
  }
};

const refresh = (req, res) => {
  try {
    const decoded = jwt.verify(req.body.refresh, process.env.REFRESH_SECRET);

    const claims = {
      email: decoded.email,
      role: decoded.role,
    };

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    res.json({ access });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "refreshing token failed" });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  refresh,
  loginArtist,
  getAllArtists,
  editArtist,
  editUser,
};
