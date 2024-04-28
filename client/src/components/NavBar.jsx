import React from "react";
import { Drawer, List, ListItem, ListItemText, Divider } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

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
        },
      }}
    >
      <List>
        <ListItem button onClick={handleLoginClick}>
          <ListItemText primary="Login" />
        </ListItem>

        <Divider />

        {role === "user" && (
          <>
            <ListItem button component={Link} to="/userhome">
              <ListItemText primary="Home" />
            </ListItem>
          </>
        )}

        {role === "artist" && (
          <>
            <ListItem button component={Link} to="/artisthome">
              <ListItemText primary="Home" />
            </ListItem>
          </>
        )}

        {(role === "user" || role === "artist") && (
          <ListItem button component={Link} to="/search">
            <ListItemText primary="Search" />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default NavBar;
