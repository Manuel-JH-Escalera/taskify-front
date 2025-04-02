import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./views/Home.tsx";
import Statistics from "./views/Statistics.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import NavBar from "./components/NavBar.tsx";
import { AuthProvider } from "react-oidc-context";
import App from "./views/Login.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "./theme/ThemeConfig";

const queryClient = new QueryClient();

const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "phone openid email",
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <QueryClientProvider client={queryClient}>
        <CssVarsProvider theme={theme} defaultMode="light">
          <CssBaseline />
          <SnackbarProvider
            autoHideDuration={5000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<App />} />
                <Route element={<NavBar />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/statistics" element={<Statistics />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </SnackbarProvider>
        </CssVarsProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
