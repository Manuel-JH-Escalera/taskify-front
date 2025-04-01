import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import { Outlet } from "react-router";

function NavBar() {
  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Task Board</Typography>
          <Box>
            <Button color="inherit">Home</Button>
            <Button color="inherit">Statistics</Button>
          </Box>
          <IconButton aria-label="theme" color="inherit">
            <Brightness4Icon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box padding={{ xs: 2, sm: 3, md: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}

export default NavBar;
