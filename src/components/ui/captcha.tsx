import React, { useState, useEffect, useRef } from "react";

interface CaptchaProps {
  onCaptchaChange: (isValid: boolean) => void;
}

export function Captcha({ onCaptchaChange }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isValid, setIsValid] = useState(false);
  const desktopCanvasRef = useRef<HTMLCanvasElement>(null);
  const mobileCanvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const desktopCanvas = desktopCanvasRef.current;
    const mobileCanvas = mobileCanvasRef.current;
    
    if (!desktopCanvas || !mobileCanvas) return;

    const desktopCtx = desktopCanvas.getContext("2d");
    const mobileCtx = mobileCanvas.getContext("2d");
    
    if (!desktopCtx || !mobileCtx) return;

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let text = "";
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);

    desktopCtx.clearRect(0, 0, desktopCanvas.width, desktopCanvas.height);
    desktopCtx.fillStyle = "#f3f4f6";
    desktopCtx.fillRect(0, 0, desktopCanvas.width, desktopCanvas.height);
    for (let i = 0; i < 50; i++) {
      desktopCtx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      desktopCtx.fillRect(Math.random() * desktopCanvas.width, Math.random() * desktopCanvas.height, 2, 2);
    }
    for (let i = 0; i < 3; i++) {
      desktopCtx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      desktopCtx.lineWidth = 1;
      desktopCtx.beginPath();
      desktopCtx.moveTo(Math.random() * desktopCanvas.width, Math.random() * desktopCanvas.height);
      desktopCtx.lineTo(Math.random() * desktopCanvas.width, Math.random() * desktopCanvas.height);
      desktopCtx.stroke();
    }
    desktopCtx.font = `bold 24px Arial`;
    desktopCtx.fillStyle = "#1f2937";
    for (let i = 0; i < text.length; i++) {
      desktopCtx.save();
      desktopCtx.translate(30 + i * 25, 35);
      desktopCtx.rotate((Math.random() - 0.5) * 0.3);
      desktopCtx.fillText(text[i], 0, 0);
      desktopCtx.restore();
    }

    mobileCtx.clearRect(0, 0, mobileCanvas.width, mobileCanvas.height);
    mobileCtx.fillStyle = "#f3f4f6";
    mobileCtx.fillRect(0, 0, mobileCanvas.width, mobileCanvas.height);
    for (let i = 0; i < 50; i++) {
      mobileCtx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      mobileCtx.fillRect(Math.random() * mobileCanvas.width, Math.random() * mobileCanvas.height, 2, 2);
    }
    for (let i = 0; i < 3; i++) {
      mobileCtx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      mobileCtx.lineWidth = 1;
      mobileCtx.beginPath();
      mobileCtx.moveTo(Math.random() * mobileCanvas.width, Math.random() * mobileCanvas.height);
      mobileCtx.lineTo(Math.random() * mobileCanvas.width, Math.random() * mobileCanvas.height);
      mobileCtx.stroke();
    }
    mobileCtx.font = `bold 18px Arial`;
    mobileCtx.fillStyle = "#1f2937";
    for (let i = 0; i < text.length; i++) {
      mobileCtx.save();
      mobileCtx.translate(25 + i * 20, 35);
      mobileCtx.rotate((Math.random() - 0.5) * 0.3);
      mobileCtx.fillText(text[i], 0, 0);
      mobileCtx.restore();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Reset captcha when component is remounted (key changes)
  useEffect(() => {
    setUserInput("");
    setIsValid(false);
    onCaptchaChange(false);
  }, []);

  useEffect(() => {
    const valid = userInput.toUpperCase() === captchaText;
    setIsValid(valid);
    onCaptchaChange(valid);
  }, [userInput, captchaText, onCaptchaChange]);

  const handleRefresh = () => {
    setUserInput("");
    generateCaptcha();
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Captcha Verification *</label>

      <div className="space-y-2 sm:space-y-3">
        <div className="hidden sm:flex items-center space-x-3">
          <input
            type="text"
            placeholder="Enter the code above"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={`flex-1 px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-200 text-base ${
              userInput && !isValid
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                : isValid
                  ? "border-green-500 focus:ring-green-500/20 focus:border-green-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-blue-500/20 focus:border-blue-500"
            }`}
          />

          <canvas
            ref={desktopCanvasRef}
            width={180}
            height={50}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 flex-shrink-0 w-[180px] h-[50px]"
          />

          <button
            type="button"
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex-shrink-0"
            title="Refresh Captcha"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>
        </div>

        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <canvas
              ref={mobileCanvasRef}
              width={180}
              height={50}
              className="border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 w-[180px] h-[50px]"
            />

            <button
              type="button"
              onClick={handleRefresh}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors flex-shrink-0"
              title="Refresh Captcha"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>

          <div className="w-full">
            <input
              type="text"
              placeholder="Enter the code above"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`w-full px-3 py-2 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-200 text-sm ${
                userInput && !isValid
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
                  : isValid
                    ? "border-green-500 focus:ring-green-500/20 focus:border-green-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
          </div>
        </div>

        {userInput && !isValid && (
          <p className="text-red-500 text-xs sm:text-sm flex items-start sm:items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="break-words leading-relaxed">Incorrect captcha code</span>
          </p>
        )}

        {isValid && (
          <p className="text-green-500 text-xs sm:text-sm flex items-start sm:items-center">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="break-words leading-relaxed">Captcha verified</span>
          </p>
        )}
      </div>
    </div>
  );
}
