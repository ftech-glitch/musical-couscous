import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ role }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/");
    window.location.reload();
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
        <ListItem button onClick={handleLoginClick} className="nav-link">
          <ListItemText primary="Login" />
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
              <ListItemText primary="Home" />
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
              <ListItemText primary="Home" />
            </ListItem>
          </>
        )}
        {(role === "user" || role === "artist") && (
          <ListItem button component={Link} to="/search" className="nav-link">
            <ListItemText primary="Search" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default NavBar;
