import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
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
      <Landing action={"Sign In"}>
        <Box component="form" Validate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            style={{ backgroundColor: "#343A40" }}
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link to="/signup" style={{ color: "#6C757D" }} variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Landing>
    </>
  );
};

export default Login;

{
  /* <div>
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
        <Link to="/signup">Sign up</Link> */
}
