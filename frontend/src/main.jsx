import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/react";

import App from "./App";

import "./styles/global.css";
import "./styles/theme.css";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log("CLERK KEY:", clerkPubKey);

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);