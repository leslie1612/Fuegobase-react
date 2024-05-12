import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "../Header";
import "./landing.css";

const defaultTheme = createTheme();

const Landing = ({ children, className, action }) => {
  return (
    <>
      <Header />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          style={{ position: "relative" }}
          item
          xs={false}
          sm={4}
          md={7}
          sx={{ marginTop: "4rem" }}
        >
          <div className="landing_picture_cover">
            <img src="./adobe6.jpeg" alt="" className="landing_picture" />
          </div>
          <h2 className="landing_subtitle">
            Empowering Data Management Through Visualization.
          </h2>
          <h3 className="landing_description">
            Fuegobase is a database service that simplifies data management
            through intuitive visual interfaces, making it easy for you to
            handle data.
          </h3>
        </Grid>
        <Grid
          style={{ marginTop: "4rem" }}
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#343A40" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {action}
            </Typography>
            <div className="landing_form">{children}</div>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Landing;
