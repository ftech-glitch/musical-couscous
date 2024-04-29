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
  const [errorMessage, setErrorMessage] = useState(null);

  const handleLogin = async () => {
    const endpoint = role === "artist" ? "/auth/login/artist" : "/auth/login";

    const res = await fetchData(endpoint, "POST", { email, password });

    if (res.ok) {
      userCtx.setAccessToken(res.data.access);
      const decoded = jwtDecode(res.data.access);
      userCtx.setRole(decoded.role);
      userCtx.setUser(decoded.user_id);
      userCtx.setArtist(decoded.artist_id);

      // Navigate to the correct homepage based on the role
      if (role === "artist") {
        navigate("/artisthome");
      } else {
        navigate("/userhome");
      }
    } else {
      setErrorMessage(res.data?.message || "Error logging in");
    }
  };

  return (
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
        id="form1"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ borderColor: "whitesmoke" }}
      />

      <MDBInput
        wrapperClass="mb-4"
        label="Password"
        id="form2"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ borderColor: "whitesmoke" }}
      />

      {errorMessage && (
        <div style={{ color: "red", marginBottom: "10px" }}>{errorMessage}</div>
      )}

      <MDBBtn
        className="mb-4"
        onClick={handleLogin}
        style={{ backgroundColor: "#333", color: "whitesmoke" }}
      >
        Sign in
      </MDBBtn>

      <div className="text-center">
        <p>
          Not a member?{" "}
          <a
            href="/register"
            onClick={() => props.setShowLogin(false)}
            style={{ color: "whitesmoke" }}
          >
            Register
          </a>
        </p>
      </div>
    </MDBContainer>
  );
};

export default Login;
