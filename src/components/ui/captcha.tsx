import React, { useState, useEffect, useRef } from 'react';

interface CaptchaProps {
  onCaptchaChange: (isValid: boolean) => void;
}

export function Captcha({ onCaptchaChange }: CaptchaProps) {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isValid, setIsValid] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.fillRect(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        2,
        2
      );
    }
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#1f2937';
    
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.translate(30 + i * 25, 35);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  useEffect(() => {
    const valid = userInput.toUpperCase() === captchaText;
    setIsValid(valid);
    onCaptchaChange(valid);
  }, [userInput, captchaText, onCaptchaChange]);

  const handleRefresh = () => {
    setUserInput('');
    generateCaptcha();
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Captcha Verification *
      </label>
      
      <div className="flex items-center space-x-3">
        <canvas
          ref={canvasRef}
          width={180}
          height={50}
          className="border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
        />
        
        <button
          type="button"
          onClick={handleRefresh}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="Refresh Captcha"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <input
        type="text"
        placeholder="Enter the code above"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 transition-all duration-200 ${
          userInput && !isValid
            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
            : isValid
            ? "border-green-500 focus:ring-green-500/20 focus:border-green-500"
            : "border-gray-300 dark:border-gray-600 focus:ring-blue-500/20 focus:border-blue-500"
        }`}
      />
      
      {userInput && !isValid && (
        <p className="text-red-500 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          Incorrect captcha code
        </p>
      )}
      
      {isValid && (
        <p className="text-green-500 text-sm flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Captcha verified
        </p>
      )}
    </div>
  );
} 