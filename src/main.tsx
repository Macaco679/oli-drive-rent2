import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/metallic-refresh.css";
import "./styles/home-v3.css";
import "./styles/home-quick-actions.css";
import "./styles/quick-action-art-app.css";
import "./styles/quick-action-art-travel.css";
import "./styles/quick-action-art-owner.css";
import "./lib/quickActionReveal";

createRoot(document.getElementById("root")!).render(<App />);
