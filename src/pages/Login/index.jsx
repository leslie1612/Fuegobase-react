import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Landing from "../../components/Landing";
import API from "../../utils/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signinForm = {
      email: email,
      password: password,
    };
    const response = await API.signin(signinForm);
    const json = await response.json();

    if (response.status === 200) {
      console.log(response);
      setToken(json.data.accessToken);
      localStorage.setItem("token", json.data.accessToken);
      // setIsLogin(true);
      navigate("/projects");
    } else {
      alert(`An unexpected error occurred. Please try again.`);
      console.error(`Authentication failed: ${json.error}`);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <>
      <Landing>
        <div>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
        </div>
        <Link to="/signup">Sign up</Link>
      </Landing>
    </>
  );
};

export default Login;
