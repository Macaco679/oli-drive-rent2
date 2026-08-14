import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./styles/metallic-refresh.css";
import "./styles/platform-refresh.css";
import "./styles/home-v3.css";
import "./styles/home-quick-actions.css";
import "./styles/home-benefits-tilt.css";
import "./styles/home-benefits-tilt-override.css";
import "./styles/home-benefits-hq.css";
import "./lib/quickActionReveal";
import "./lib/benefitTiltEnhancer";

createRoot(document.getElementById("root")!).render(<App />);
