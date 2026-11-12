import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          autoClose={2000}
          position="bottom-right"
          theme="colored"
          // style={{ width: "120px" }} // container width
          toastStyle={{ minHeight: "50px" }}
        />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);
