import React, { useState, useContext } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon,
} from "mdb-react-ui-kit";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";

const Login = (props) => {
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetchData("/auth/login", "POST", { email, password });

    if (res.ok) {
      userCtx.setAccessToken(res.data.access);
      const decoded = jwtDecode(res.data.access);
      userCtx.setRole(decoded.role);
    } else {
      alert(JSON.stringify(res.data));
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
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

      <div className="d-flex justify-content-between mx-3 mb-4">
        <MDBCheckbox
          name="rememberMe"
          id="flexCheckDefault"
          label="Remember me"
        />
        <a href="#!">Forgot password?</a>
      </div>

      <MDBBtn className="mb-4" onClick={handleLogin}>
        Sign in
      </MDBBtn>

      <div className="text-center">
        <p>
          Not a member?{" "}
          <a href="#!" onClick={() => props.setShowLogin(false)}>
            Register
          </a>
        </p>
      </div>
    </MDBContainer>
  );
};

export default Login;
