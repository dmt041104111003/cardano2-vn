// app/page.tsx
"use client";

import { Button } from "@headlessui/react";
import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [pubKey, setPubKey] = useState("");
  const [did, setDid] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleParse = () => {
    try {
      setError("");
      const data = JSON.parse(input);

      const joinedHex = (data["10"] as string[])
        .map((s) => s.replace(/^0x/i, ""))
        .join("")
        .toLowerCase();

      const marker = "032100";
      const idx = joinedHex.indexOf(marker);
      if (idx === -1) throw new Error("Không tìm thấy BIT STRING (032100)");

      let pubKeyHex = joinedHex.slice(idx + marker.length, idx + marker.length + 64);

      if (pubKeyHex.startsWith("00")) {
        pubKeyHex = pubKeyHex.slice(2);
      }

      const pubKeyBuf = Buffer.from(pubKeyHex, "hex");
      const didPart = pubKeyBuf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

      setPubKey(pubKeyHex);
      setDid(`id.catalyst://cardano/${didPart}`);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 transition">
      <div className="w-full max-w-2xl rounded-2xl shadow-lg bg-white dark:bg-gray-800 p-6 transition flex  flex-col gap-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">DID Catalyst Extractor</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 rounded-xl border text-sm font-medium text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        <textarea
          className="w-full h-40 border rounded-md p-2 font-mono text-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          placeholder="Paste JSON data here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex items-center justify-center">
          <Button
            onClick={handleParse}
            className="inline-flex items-center gap-2 rounded-sm border border-white/30 bg-gray-800/50 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:border-white/50 hover:bg-gray-700/50"
          >
            Generate Catalyst ID
          </Button>
        </div>

        {error && (
          <div className="dark:text-gray-100 rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 text-center py-5 px-3">
            <p className=" text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {did && (
          <div className="mt-4 dark:text-gray-100 rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 text-center py-5 px-3">
            <p className="font-bold text-gray-900 dark:text-gray-100">DID Catalyst:</p>
            <p className="break-all font-mono text-sm text-gray-800 dark:text-gray-200">{did}</p>
          </div>
        )}
      </div>
    </main>
  );
}
