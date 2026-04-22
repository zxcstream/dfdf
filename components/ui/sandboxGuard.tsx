// components/SandboxGuard.jsx
"use client";

import { useSandboxDetection } from "@/hooks/sandboxDetection";

export default function SandboxGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const isSandboxed = useSandboxDetection();

  if (isSandboxed) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center p-8">
        <h1 className="text-2xl font-bold  mb-3">⚠️ Sandbox Detected</h1>
        <p className="text-gray-600 mb-2">
          This page cannot be embedded inside a sandboxed iframe.
        </p>
        <p className="text-gray-600">
          Please remove the{" "}
          <code className=" text-red-500 px-1.5 py-0.5 rounded text-sm font-medium">
            sandbox
          </code>{" "}
          attribute from your iframe, or contact the site owner.
        </p>
      </div>
    );
  }

  return children;
}
