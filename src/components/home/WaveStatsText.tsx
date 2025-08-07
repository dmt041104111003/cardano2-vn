import React from 'react';

export default function WaveStatsText() {
  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4 tracking-wide">C2VN STATS</h2>
        <div className="flex flex-wrap gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">1.29M <span className="align-super text-sm sm:text-lg">₳</span></div>
            <div className="text-sm sm:text-base text-white/80">Paid to Delegates</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">519</div>
            <div className="text-sm sm:text-base text-white/80">delegates</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">3,600 <span className="align-super text-sm sm:text-lg">₳</span></div>
            <div className="text-sm sm:text-base text-white/80">Causes Fund</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">23.93M <span className="align-super text-sm sm:text-lg">₳</span></div>
            <div className="text-sm sm:text-base text-white/80">Staked with LIDO</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">92,000 <span className="align-super text-sm sm:text-lg">₳</span></div>
            <div className="text-sm sm:text-base text-white/80">Founders Pledge</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">14</div>
            <div className="text-sm sm:text-base text-white/80">Community Contributors</div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8">
          <div className="text-2xl sm:text-3xl font-bold text-white">3219</div>
          <div className="text-sm sm:text-base text-white/80">lifetime<br/>blocks</div>
        </div>
      </div>

    
      <div className="w-full h-px bg-white/30 my-8"></div>

      <div>
        <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4 tracking-wide">CARDANO STATS</h2>
        <div className="flex flex-wrap gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4 items-end">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">1,683,196</div>
            <div className="text-sm sm:text-base text-white/80">Total Staked Addresses</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">1339</div>
            <div className="text-sm sm:text-base text-white/80">Total Pools</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">558</div>
            <div className="text-sm sm:text-base text-white/80">Current Epoch</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">$0.74</div>
            <div className="text-sm sm:text-base text-white/80">price USD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
