import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Landing from "../../components/Landing";
import API from "../../utils/api";

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
    const response = await API.signup(signupForm);
    const json = await response.json();

    if (response.status === 201) {
      setToken(json.data.accessToken);
      localStorage.setItem("token", json.data.accessToken);
      navigate("/projects");
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
    <Landing action={"Sign Up"}>
      {/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar> */}
      {/* <Typography component="h1" variant="h5">
        Sign Up
      </Typography> */}
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
        />
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
        {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign Up
        </Button>
        <Grid container>
          {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
          <Grid item>
            <Link to="/" variant="body2">
              {"Already have an account? Sign In"}
            </Link>
          </Grid>
        </Grid>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Box>
    </Landing>
  );
};

export default Registration;

{
  /* <>
      <Landing>
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
        <Link to="/">Sign in</Link>
      </Landing>
    </> */
}
