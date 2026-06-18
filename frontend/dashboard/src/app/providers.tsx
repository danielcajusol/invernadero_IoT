"use client";

import { Provider } from "@/components/ui/provider";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });    
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: "100vh", backgroundColor: "black" }} />;
  }

  return <Provider>{children}</Provider>;
}
