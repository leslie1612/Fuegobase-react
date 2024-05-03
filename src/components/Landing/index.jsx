// const Landing = ({ children, className }) => {
//   return (
//     <>
//       <div className={["layout_wrapper", className].join(" ")}>
//         <div className="main">
//           <div className="content">{children}</div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Landing;

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

// function Copyright(props) {
//   return (
//     <Typography
//       variant="body2"
//       color="text.secondary"
//       align="center"
//       {...props}
//     >
//       {"Copyright © "}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{" "}
//       {new Date().getFullYear()}
//       {"."}
//     </Typography>
//   );
// }

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

const Landing = ({ children, className, action }) => {
  return (
    <>
      <Header />
      <ThemeProvider theme={defaultTheme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            style={{ position: "relative" }}
            item
            xs={false}
            sm={4}
            md={7}
            sx={{ marginTop: "4rem" }}
            // sx={{
            //   backgroundImage: "url(/folder.jpeg)",
            //   backgroundRepeat: "no-repeat",
            //   // backgroundColor: (t) =>
            //   //   t.palette.mode === "light"
            //   //     ? t.palette.grey[50]
            //   //     : t.palette.grey[900],
            //   backgroundSize: "80vh",
            //   backgroundPosition: "cover",
            //   backgroundColor: "rgba(173, 181, 189,0.5)",
            //   opacity: 0.5,
            // }}
          >
            <img src="./folder.jpeg" alt="" className="landing_picture" />
            <h2 className="landing_subtitle">
              Empowering Data Management Through Visualization.
            </h2>
            <h3 className="landing_description">
              Fuegobase is a database service that simplifies data management
              through intuitive visual interfaces, making it easy for you to
              handle data.
            </h3>
            {/* <img src="./folder.jpeg" alt="" className="landing_picture" /> */}
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
      </ThemeProvider>
    </>
  );
};

export default Landing;
