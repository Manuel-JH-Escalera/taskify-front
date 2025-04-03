import { useAuth } from "react-oidc-context";
import {
  Button,
  Stack,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";

function Login() {
  const auth = useAuth();

  const LoginButton = () => (
    <Button variant="contained" fullWidth onClick={() => auth.signinRedirect()}>
      Sign in
    </Button>
  );

  const LogoSection = () => (
    <>
      <Typography variant="h3" fontWeight="bold">
        Taskify
      </Typography>
      <Typography variant="subtitle1">Tasks Manage System</Typography>
      <Typography variant="overline">By Manuel Escalera</Typography>
    </>
  );

  const renderContent = () => {
    if (auth.isLoading) {
      return (
        <Stack
          spacing={2}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100%", minHeight: "180px" }}
        >
          <CircularProgress />
        </Stack>
      );
    }

    if (auth.error) {
      return (
        <Stack
          spacing={2}
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {auth.error.message || "Error getting session"}
          </Alert>
          <LoginButton />
        </Stack>
      );
    }

    return (
      <Stack
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ height: "100%" }}
      >
        <LogoSection />
        <LoginButton />
      </Stack>
    );
  };

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
          {renderContent()}
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
