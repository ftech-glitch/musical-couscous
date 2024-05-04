# G.M.

Get ready to step into a musical time machine with G.M.(Good Music) the retro-inspired music streaming app that brings back the nostalgia of searching and discovering new songs.

This app combines the charm of old-school aesthetics with the convenience of modern streaming, offering a unique experience for music lovers who appreciate a touch of the past.

## Key Features
Music Library: Browse a collection of songs, albums, and playlists. Discover new music and revisit your favorite tracks with ease.

<img width="1434" alt="Screenshot 2024-05-04 at 2 17 11 PM" src="https://github.com/ftech-glitch/musical-couscous/assets/101855038/5f3bb065-e5d7-409c-82d5-8dbe63ac5da4">

Search and Discover: Use the search functionality to find specific songs, albums, or artists. Explore new genres and artists to broaden your musical horizons.

<img width="1430" alt="Screenshot 2024-05-04 at 2 18 16 PM" src="https://github.com/ftech-glitch/musical-couscous/assets/101855038/3b415c65-f1af-4617-851b-c70ba1002cb1">

Playlists (User): Create and customize your playlists. Add or remove songs, and personalize your listening experience.

<img width="1434" alt="Screenshot 2024-05-04 at 2 17 47 PM" src="https://github.com/ftech-glitch/musical-couscous/assets/101855038/754e213a-540f-4673-93bc-6268f6b12918">

Albums (Artist): Create and customize your albums. Upload or remove new songs, and share your music with others.

<img width="1437" alt="Screenshot 2024-05-04 at 2 18 38 PM" src="https://github.com/ftech-glitch/musical-couscous/assets/101855038/207d3e51-633d-4249-9f6e-feca94a2f00e">


Music Player: Enjoy a simple music player with basic controls, including play, pause, skip, and volume adjustment. Play your music seamlessly while browsing the app.

<img width="515" alt="Screenshot 2024-05-04 at 2 30 54 PM" src="https://github.com/ftech-glitch/musical-couscous/assets/101855038/df0645ac-bb77-4590-831f-8fde23090f3b">

## Technologies Used

This app was built using the following technologies:

- React
- Express
- PostgreSQL
- Node.js

## Getting Started

To start using the app, follow these steps:

1. Install required dependencies:

Client:
cd client/
```
npm install
```

React and related dependencies
(```)
npm install react react-dom
npm install jwt-decode
(```)

UI and styling frameworks
(```)
npm install @mui/material @emotion/react @emotion/styled
npm install mdb-react-ui-kit
npm install styled-components
npm install @fortawesome/free-regular-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome
npm install react-beautiful-dnd
(```)

Server:
cd server/
(```)
npm install
(```)

Express and related middleware
(```)
npm install express
npm install dotenv
npm install cors
npm install express-rate-limit
npm install helmet
(```)

Authentication and encryption
(```)
npm install jsonwebtoken jwt-decode
npm install bcrypt
(```)

Database and ORM
(```)
npm install pg
npm install sequelize
(```)

File handling
(```)
npm install multer
(```)

UUID for unique identifiers
(```)
npm install uuid
(```)

2. Create the required environment files:

Client(.env file)
(```)
VITE_SERVER=http://127.0.0.1:[PORT]
(```)

Server(.env file)
(```)
DB_USER=[Your_Username]
DB_HOST=localhost
DB_NAME=[Your_Database_Name]
DB_PASSWORD=[Your_Password]
DB_PORT=[Your_Database_Port]
ACCESS_SECRET=[Your_Access_Token]
REFRESH_SECRET=[Your_Refresh_Token]
(```)

3. Start the development servers:

To run them individually:
In one terminal
cd client/
(```)
npm run dev
(```)
In another terminal
cd server/
(```)
npm run dev
(```)

4. Access the deployed app on your local server at http://localhost:[PORT].

## Next Steps
Planned future enhancements for G.M.:

- Social Features: Implement sharing playlists with friends and following other users.
- Enhanced Music Player: Add additional controls like shuffle, repeat, and queue management.
- Music Recommendations: Use algorithms to recommend music based on user preferences and listening history.
- Integration with External Services: Connect to external music services for more music options and variety.
