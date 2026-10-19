import { useState, useEffect } from "react";

function readRoute() {
  const raw = window.location.hash || "";
  return raw.replace(/^#\/?/, "").split("?")[0].toLowerCase();
}

export function useHashRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
