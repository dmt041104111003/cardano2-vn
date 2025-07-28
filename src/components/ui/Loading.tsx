import React, { useEffect, useRef, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, 30);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity">
      <div className="pointer-events-none select-none fixed right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-0 opacity-20">
        <div className="relative w-[900px] h-[900px] sm:w-[1500px] sm:h-[1500px] md:w-[2400px] md:h-[2400px] rounded-full bg-gradient-to-br from-[#00A3FF]/10 to-[#003C8C]/10">
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#00A3FF]/20 to-[#003C8C]/20">
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#00A3FF]/30 to-[#003C8C]/30">
              <div className="absolute inset-4 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src="/images/common/loading.png"
                  className="w-full h-full object-contain"
                  alt="Cardano2VN Logo"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center z-10">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <img
            src="/images/common/loading.png"
            className="w-full h-full object-contain"
            alt="Cardano2VN Logo"
            draggable={false}
          />
        </div>
        <div className="text-[32px] font-bold text-[#003C8C] mb-2">CARDANO2VN.IO</div>
        <div className="text-xl text-[#666666] tracking-[0.2em] uppercase">BREAK THE BLOCKS</div>
        <div className="mt-6 flex flex-col items-center space-y-2">
          <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00A3FF] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-sm text-[#666666]">{progress}%</div>
        </div>
      </div>
    </div>
  );
} 