// hooks/useSandboxDetection.js
import { useState, useEffect } from "react";

export function useSandboxDetection() {
  const [isSandboxed, setIsSandboxed] = useState(false);

  
  useEffect(() => {
    const inIframe = window.self !== window.top;
    if (!inIframe) return; // not in an iframe, don't bother checking

    const popup = window.open("", "_blank", "width=1,height=1");
    if (popup === null) {
      setIsSandboxed(true);
    } else {
      popup.close();
    }
  }, []);

  return isSandboxed;
}
