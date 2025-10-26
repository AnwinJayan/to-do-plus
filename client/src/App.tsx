import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/ThemeContext";

import { router } from "./router";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={1000} />
    </ThemeProvider>
  );
}
