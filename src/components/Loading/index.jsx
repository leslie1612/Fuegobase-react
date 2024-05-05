import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate({ size, color }) {
  return (
    <Box sx={{ display: "flex", margin: "10px 0 0 10px" }}>
      <CircularProgress size={size} color={color} />
    </Box>
  );
}
