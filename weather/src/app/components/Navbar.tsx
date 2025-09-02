"use client";

import React from "react";

export default function Navbar({
  language,
  onToggle,
  title = "Weather Dashboard",
}: {
  language: "th" | "en";
  onToggle: () => void;
  title?: string;
}) {
  return (
    <nav className="w-full bg-white/80 backdrop-blur sticky top-0 z-20 shadow-sm">
      <div className="w-full mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Language:</span>
          <button
            type="button"
            onClick={onToggle}
            className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
          >
            {language === "th" ? "ไทย / EN" : "EN / ไทย"}
          </button>
        </div>
      </div>
    </nav>
  );
}


