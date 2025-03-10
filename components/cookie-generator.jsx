import { useEffect } from "react";

const CookieGenerator = ({ onGenerateCookies, cookiesPerSecond }) => {
  useEffect(() => {
    let interval;

    const startGeneratingCookies = () => {
      interval = setInterval(() => {
        onGenerateCookies(cookiesPerSecond);
      }, 1000);
    };

    const stopGeneratingCookies = () => {
      clearInterval(interval);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopGeneratingCookies();
      } else {
        startGeneratingCookies();
      }
    };

    startGeneratingCookies();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onGenerateCookies, cookiesPerSecond]);

  return null; // No renderiza nada, solo ejecuta la lógica
};

export default CookieGenerator;
