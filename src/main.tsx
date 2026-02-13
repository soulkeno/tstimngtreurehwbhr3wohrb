import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

const params = new URLSearchParams(window.location.search);
const redirectPath = params.get("p");

if (redirectPath) {
  window.history.replaceState(null, "", redirectPath);
}
