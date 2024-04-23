CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) NOT NULL,
  hash TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
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
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  cover VARCHAR(255) 
);

CREATE TABLE albums (
  album_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  artist_id UUID REFERENCES artists(artist_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  cover VARCHAR(255)  
);

CREATE TABLE songs (
  song_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  album VARCHAR(255),
  genre VARCHAR(50),
  length INT,
  album_id UUID REFERENCES albums(album_id) ON DELETE CASCADE,
  playlist_id UUID REFERENCES playlists(playlist_id) ON DELETE SET NULL,
  details TEXT
);

CREATE TABLE favourites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(song_id) ON DELETE CASCADE,
  favourited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, song_id)
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

ALTER TABLE playlists DROP CONSTRAINT playlists_user_id_fkey;
ALTER TABLE playlists
ADD CONSTRAINT playlists_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;
