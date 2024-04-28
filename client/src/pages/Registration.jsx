import React, { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { Select, MenuItem, InputLabel } from "@mui/material";

const Registration = (props) => {
  const fetchData = useFetch();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const registerUser = async () => {
    const res = await fetchData("/auth/register", "POST", {
      email,
      username,
      password,
      role,
    });

    if (res.ok) {
      setEmail("");
      setUsername("");
      setPassword("");
      setRole("user");
    } else {
      console.log(res.data);
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <InputLabel>Role</InputLabel>
      <Select
        value={role}
        onChange={(e) => setRole(e.target.value)}
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
      />

      <MDBInput
        wrapperClass="mb-4"
        label="Username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <MDBInput
        wrapperClass="mb-4"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <MDBBtn className="mb-4" onClick={registerUser}>
        Register
      </MDBBtn>

      <div className="text-center">
        <p>
          Already have an account?{" "}
          <a href="/" onClick={() => props.setShowLogin(true)}>
            Login
          </a>
        </p>
      </div>
    </MDBContainer>
  );
};

export default Registration;
