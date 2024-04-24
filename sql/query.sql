CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
  artist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE playlists (
  playlist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  cover VARCHAR(255),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE albums (
  album_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  cover VARCHAR(255),
  CONSTRAINT fk_artist_id FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

CREATE TABLE songs (
  song_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  album_id UUID,
  playlist_id UUID,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  album VARCHAR(255),
  genre VARCHAR(50),
  length INT,
  details TEXT,
  CONSTRAINT fk_album_id FOREIGN KEY (album_id) REFERENCES albums(album_id),
  CONSTRAINT fk_playlist_id FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id)
);

CREATE TABLE favourites (
  user_id UUID,
  song_id UUID,
  favourited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, song_id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_song_id FOREIGN KEY (song_id) REFERENCES songs(song_id)
);

CREATE OR REPLACE FUNCTION update_last_login() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_last_login
BEFORE UPDATE ON users
FOR EACH ROW
WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
EXECUTE FUNCTION update_last_login();

CREATE OR REPLACE FUNCTION update_artist_last_login() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_login = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_artist_last_login
BEFORE UPDATE ON artists
FOR EACH ROW
WHEN (OLD.last_login IS DISTINCT FROM NEW.last_login)
EXECUTE FUNCTION update_artist_last_login();

ALTER TABLE songs
ALTER COLUMN length TYPE VARCHAR(50) USING length::VARCHAR;
