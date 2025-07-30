import { useEffect, useState } from "react";

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Ensure window is available (client-side only)
    if (typeof window !== "undefined") {
      const userAgent = navigator.userAgent.toLowerCase();
      // A simple RegExp to detect mobile user agents
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
          userAgent
        );
      setIsMobile(isMobileDevice);
    }
  }, []);

  return isMobile;
}
