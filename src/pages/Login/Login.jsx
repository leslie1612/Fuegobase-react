import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null); // New state for handling error messages
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    const signinForm = {
      email: email,
      password: password,
    };
    const response = await api.signin(signinForm);
    const json = await response.json();

    if (response.status === 200) {
      console.log(response.data);
      setToken(json.data.accessToken);
      localStorage.setItem("token", json.data.accessToken);
      navigate("/");
    } else {
      alert(`An unexpected error occurred. Please try again.`);
      console.error(`Authentication failed: ${json.error}`);
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <div>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
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
  );
};

export default Login;
