import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

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
          minHeight: "100px",
        }}
      >
        <CardContent>
          <Stack spacing={3} justifyContent="center" alignItems="center">
            <Typography variant="h5" component="div" textAlign="center">
              Página no encontrada
            </Typography>
            <Alert severity="error" sx={{ width: "100%" }}>
              La ruta solicitada no existe
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
            >
              Volver al inicio
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default NotFound;
