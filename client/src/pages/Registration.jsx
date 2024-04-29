import React, { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { Select, MenuItem, InputLabel } from "@mui/material";
import useFetch from "../hooks/useFetch";

const Registration = (props) => {
  const fetchData = useFetch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMessage, setErrorMessage] = useState(null);

  const registerUser = async () => {
    const res = await fetchData("/auth/register", "POST", {
      email,
      username,
      password,
      role,
    });

    if (res.ok) {
      // Clear input fields after successful registration
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("user");
    } else {
      setErrorMessage(res.data?.message || "Error during registration.");
    }
  };

  return (
    <>
      <div className="home-container">
        <h1 className="home-greeting">Don't worry, we won't bite.</h1>
      </div>
      <MDBContainer
        className="p-3 my-5 d-flex flex-column w-50"
        style={{ textAlign: "left" }}
      >
        <InputLabel
          id="role-label"
          sx={{ color: "whitesmoke", marginBottom: "10px" }}
        >
          Role
        </InputLabel>
        <Select
          labelId="role-label"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{
            width: "100%",
            padding: "0.5px",
            border: "1px solid whitesmoke",
            color: "whitesmoke",
            backgroundColor: "#333",
            "& .MuiSvgIcon-root": { color: "whitesmoke" },
          }}
          className="mb-4"
        >
          <MenuItem value="user">User</MenuItem>
          <MenuItem value="artist">Artist</MenuItem>
        </Select>

        <MDBInput
          wrapperClass="mb-4"
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ borderColor: "whitesmoke" }}
        />

        <MDBInput
          wrapperClass="mb-4"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ borderColor: "whitesmoke" }}
        />

        <MDBInput
          wrapperClass="mb-4"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ borderColor: "whitesmoke" }}
        />

        {errorMessage && (
          <div style={{ color: "red", marginBottom: "10px" }}>
            {errorMessage}
          </div>
        )}

        <MDBBtn
          className="mb-4"
          onClick={registerUser}
          style={{ backgroundColor: "#1db954", color: "whitesmoke" }}
        >
          Register
        </MDBBtn>

        <div className="text-center">
          <p>
            Already have an account?{" "}
            <a
              href="/"
              onClick={() => props.setShowLogin(true)}
              style={{ color: "whitesmoke" }}
            >
              Login
            </a>
          </p>
        </div>
      </MDBContainer>
    </>
  );
};

export default Registration;
