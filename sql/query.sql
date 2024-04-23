-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  email VARCHAR(255) UNIQUE NOT NULL, 
  hash TEXT NOT NULL, 
  role VARCHAR(50) NOT NULL DEFAULT 'user', 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Artists Table
CREATE TABLE artists (
  artist_id SERIAL PRIMARY KEY,
  hash TEXT NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Playlists Table
CREATE TABLE playlists (
  playlist_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  cover VARCHAR(255) -- URL or file path to the cover image
);

-- Albums Table
CREATE TABLE albums (
  album_id SERIAL PRIMARY KEY,
  artist_id INT REFERENCES artists(artist_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  cover VARCHAR(255) -- URL or file path to the cover image
);

-- Songs Table
CREATE TABLE songs (
  song_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  album VARCHAR(255),
  genre VARCHAR(50),
  length INT,
  album_id INT REFERENCES albums(album_id) ON DELETE CASCADE,
  playlist_id INT REFERENCES playlists(playlist_id) ON DELETE SET NULL,
  details TEXT
);

-- Favourites Table
CREATE TABLE favorites (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  song_id INT REFERENCES songs(song_id) ON DELETE CASCADE,
  favourited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, song_id)
);

ALTER TABLE favorites RENAME TO favourites;