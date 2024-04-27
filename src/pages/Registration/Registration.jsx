import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Registration = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const signupForm = {
      name: username,
      email: email,
      password: password,
    };
    const response = await api.signup(signupForm);
    const json = await response.json();

    if (response.status === 201) {
      setToken(json.data.accessToken);
      localStorage.setItem("token", json.data.accessToken);
      navigate("/");
    } else {
      alert(`Registration failed: ${json.error}`);
      setToken(null);
      localStorage.removeItem("token");
    }

    setUsername("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Register</button>
        </form>
      </div>
      <Link to="/signin">Sign in</Link>
    </>
  );
};

export default Registration;
