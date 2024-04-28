import React, { useState, useContext } from "react";
import { MDBContainer, MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { Select, MenuItem, InputLabel } from "@mui/material";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const Login = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = async () => {
    // determine the endpoint based on the selected role
    const endpoint = role === "artist" ? "/auth/login/artist" : "/auth/login";

    const res = await fetchData(endpoint, "POST", { email, password });

    if (res.ok) {
      userCtx.setAccessToken(res.data.access);
      const decoded = jwtDecode(res.data.access);
      userCtx.setRole(decoded.role);

      navigate("/");
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <InputLabel id="role-label">Role</InputLabel>
      <Select
        labelId="role-label"
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
        id="form1"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <MDBInput
        wrapperClass="mb-4"
        label="Password"
        id="form2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <MDBBtn className="mb-4" onClick={handleLogin}>
        Sign in
      </MDBBtn>

      <div className="text-center">
        <p>
          Not a member?{" "}
          <a href="/register" onClick={() => props.setShowLogin(false)}>
            Register
          </a>
        </p>
      </div>
    </MDBContainer>
  );
};

export default Login;
