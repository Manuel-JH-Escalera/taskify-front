import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    taskGroup: {
      background: string;
      dragOver: string;
    };
  }

  interface PaletteOptions {
    taskGroup?: {
      background?: string;
      dragOver?: string;
    };
  }
}

export const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#3f51b5",
        },
        secondary: {
          main: "#dc004e",
        },
        background: {
          default: "#f5f5f5",
          paper: "#ffffff",
        },
        taskGroup: {
          background: "#e9eaec",
          dragOver: "#e6f7ff",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#90caf9",
        },
        secondary: {
          main: "#f48fb1",
        },
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
        taskGroup: {
          background: "#2d2d2d",
          dragOver: "#3a465a",
        },
      },
    },
  },
});
