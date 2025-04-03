import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Stack,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Outlet, Link, Navigate } from "react-router";
import { useAuth } from "react-oidc-context";
import { useColorScheme } from "@mui/material/styles";
import LogoutButton from "./LogoutButton";

function NavBar() {
  const auth = useAuth();
  const { mode, setMode } = useColorScheme();

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  if (auth.isLoading) {
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Card
          sx={{
            width: { xs: "90%", sm: "70%", md: "50%", lg: "30%" },
            minHeight: "240px",
            display: "flex",
          }}
        >
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              spacing={2}
              justifyContent="center"
              alignItems="center"
              sx={{ height: "100%" }}
            >
              <CircularProgress />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
