import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import GlobalStyle from "./styles/global";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalStyle></GlobalStyle>
    <App />
  </React.StrictMode>
);
