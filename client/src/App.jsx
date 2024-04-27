import React, { useState } from "react";
import BooksDisplay from "./components/BooksDisplay";
import Login from "./components/Login";
import UserContext from "./context/user";
import Registration from "./components/Registration";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  return (
    <>
      <UserContext.Provider
        value={{ accessToken, setAccessToken, role, setRole }}
      >
        {accessToken.length > 0 && <BooksDisplay></BooksDisplay>}
        {accessToken.length === 0 && showLogin && (
          <Login setShowLogin={setShowLogin}></Login>
        )}
        {accessToken.length === 0 && !showLogin && (
          <Registration setShowLogin={setShowLogin}></Registration>
        )}
      </UserContext.Provider>
    </>
  );
}

export default App;
