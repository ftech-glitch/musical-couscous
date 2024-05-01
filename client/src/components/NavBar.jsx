import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../context/user";
import "./NavBar.css";
import ghost from "./ghost.png";

const NavBar = ({ role, setIsLoggedIn, isLoggedIn }) => {
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  const handleLogoutClick = () => {
    if (userCtx.isLoggedIn) {
      // logout: Clear session/token, redirect to login
      userCtx.setAccessToken("");
      userCtx.setRole("");
      userCtx.setUser(null);
      userCtx.setIsLoggedIn(false);
      navigate("/");
    } else {
      navigate("/");
    }
    window.location.reload(); // refresh
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 200,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 200,
          boxSizing: "border-box",
          backgroundColor: "#2b2b2b",
          boxShadow: "0 0 10px #1db954",
        },
      }}
    >
      <List>
        <ListItem button onClick={handleLogoutClick} className="nav-link">
          <ListItemText primary={userCtx.isLoggedIn ? "Logout" : "Login"} />
        </ListItem>
        <Divider style={{ background: "#ff4500", color: "whitesmoke" }} />{" "}
        {role === "user" && (
          <>
            <ListItem
              button
              component={Link}
              to="/userhome"
              className="nav-link"
            >
              <ListItemText primary="Library" />
            </ListItem>
          </>
        )}
        {role === "artist" && (
          <>
            <ListItem
              button
              component={Link}
              to="/artisthome"
              className="nav-link"
            >
              <ListItemText primary="Library" />
            </ListItem>
          </>
        )}
        {(role === "user" || role === "artist") && (
          <ListItem button component={Link} to="/search" className="nav-link">
            <ListItemText primary="Search" />
          </ListItem>
        )}
        {userCtx.isLoggedIn && (
          <ListItem button component={Link} to="/game" className="nav-link">
            <ListItemIcon>
              <img
                src={ghost}
                alt="Game Icon"
                style={{ width: "30px", height: "30px" }}
              />
            </ListItemIcon>
            {/* <ListItemText primary="Game" /> */}
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default NavBar;
