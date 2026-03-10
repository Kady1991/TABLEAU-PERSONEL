import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import theme from "./theme";

const routerFutureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter future={routerFutureFlags}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);