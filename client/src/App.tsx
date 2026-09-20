import { useEffect } from "react";
import Home from "./pages/Home";
import { ThemeProvider } from "./contexts/ThemeContext";

export default function App() {
  useEffect(() => {
    const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.replace(
      /\/+$/,
      ""
    );
    const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;

    if (
      !endpoint ||
      !websiteId ||
      document.querySelector("script[data-chronicles-analytics]")
    ) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = `${endpoint}/umami`;
    script.dataset.websiteId = websiteId;
    script.dataset.chroniclesAnalytics = "true";
    document.head.appendChild(script);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" switchable>
      <Home />
    </ThemeProvider>
  );
}
