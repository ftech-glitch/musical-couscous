CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE artists (
  artist_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

ALTER TABLE songs
ALTER COLUMN length TYPE VARCHAR(50) USING length::VARCHAR;

ALTER TABLE songs
ADD COLUMN audio_file VARCHAR(255);

CREATE TABLE playlist_songs (
  playlist_id UUID,
  song_id UUID,
  PRIMARY KEY (playlist_id, song_id),
  CONSTRAINT fk_playlist_id FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
  CONSTRAINT fk_song_id FOREIGN KEY (song_id) REFERENCES songs(song_id)
);

CREATE TABLE favorites (
  favorite_id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  album_id UUID NOT NULL,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id),
  CONSTRAINT fk_album FOREIGN KEY (album_id) REFERENCES albums(album_id)
);

CREATE TABLE favorites_artist (
  favorite_id UUID PRIMARY KEY,
  artist_id UUID NOT NULL,
  album_id UUID NOT NULL,
  CONSTRAINT fk_artist FOREIGN KEY (artist_id) REFERENCES artists(artist_id),
  CONSTRAINT fk_album FOREIGN KEY (album_id) REFERENCES albums(album_id)
);

