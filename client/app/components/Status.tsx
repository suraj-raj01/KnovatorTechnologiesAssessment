"use client";

import { useEffect, useState } from "react";
import { socket } from "../../lib/socket";

export default function StatusView() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Idle");

  useEffect(() => {
    socket.on("import:progress", ({ progress }) => {
      setProgress(progress);
      setStatus("Importing...");
    });

    socket.on("import:completed", () => {
      setProgress(100);
      setStatus("Completed");
    });

    socket.on("import:failed", ({ reason }) => {
      setStatus(`Failed: ${reason}`);
    });

    return () => {
      socket.off("import:progress");
      socket.off("import:completed");
      socket.off("import:failed");
    };
  }, []);

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-lg font-semibold">Import Status</h2>
      <p>{status}</p>

      <div className="w-full bg-gray-200 h-3 mt-3 rounded">
        <div
          className="bg-blue-600 h-3 rounded transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm mt-1">{progress}%</p>
    </div>
  );
}
