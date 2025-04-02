import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Stack,
  useTheme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Outlet, Link } from "react-router";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useColorScheme } from "@mui/material/styles";
import LogoutButton from "./LogoutButton";

function NavBar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();

  useEffect(() => {
    if (!auth.isLoading) {
      if (!auth.isAuthenticated) {
        navigate("/login");
      }
    }
  }, [auth, navigate]);

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Taskify</Typography>
          <Box>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/statistics">
              Statistics
            </Button>
          </Box>
          <Stack direction="row" spacing={2}>
            <IconButton
              aria-label="toggle theme"
              color="inherit"
              onClick={toggleColorMode}
            >
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            <LogoutButton />
          </Stack>
        </Toolbar>
      </AppBar>
      <Box padding={{ xs: 2, sm: 3, md: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}

export default NavBar;
