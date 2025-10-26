import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider as StoreProvider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { store } from "./store";
import "./assets/css/main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      appearance={{ baseTheme: [dark] }}
    >
      <StoreProvider store={store}>
        <App />
      </StoreProvider>
    </ClerkProvider>
  </>
);
