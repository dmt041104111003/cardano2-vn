import React from "react";
import { useQuery } from "@tanstack/react-query";

const POOL_ID = process.env.NEXT_PUBLIC_POOL_ID;
const BLOCKFROST_KEY = process.env.NEXT_PUBLIC_BLOCKFROST_KEY;

function useBlockfrost<T>(url: string, select?: (data: any) => T) {
  return useQuery({
    queryKey: [url],
    queryFn: async () => {
      const res = await fetch(url, {
        headers: { project_id: BLOCKFROST_KEY! },
      });
      if (!res.ok) throw new Error("Blockfrost error");
      const data = await res.json();
      return select ? select(data) : data;
    },
    refetchInterval: 300000,
    staleTime: 300000,
    retry: 2,
  });
}

export default function WaveStatsText() {
  const { data: paidToDelegates, error: paidToDelegatesError } = useBlockfrost(
    `https://cardano-mainnet.blockfrost.io/api/v0/pools/${POOL_ID}/history`,
    (data) => {
      console.log("Paid to Delegates (history) response:", data);
      if (!Array.isArray(data)) return null;
      const total = data.reduce((sum, r) => sum + Number(r.rewards), 0);
      return `${(total / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} ₳`;
    },
  );

  const { data: poolInfo, error: poolInfoError } = useBlockfrost(`https://cardano-mainnet.blockfrost.io/api/v0/pools/${POOL_ID}`, (data) => {
    console.log("Pool info response:", data);
    return data;
  });

  const delegates = poolInfo?.live_delegators?.toLocaleString() ?? "None";
  const blocksMinted = poolInfo?.blocks_minted?.toLocaleString() ?? "None";
  const stakedWithC2VN = poolInfo?.live_stake
    ? `${(Number(poolInfo.live_stake) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} ₳`
    : "None";
  const foundersPledge = poolInfo?.live_pledge
    ? `${(Number(poolInfo.live_pledge) / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 })} ₳`
    : "None";

  const { data: currentEpoch } = useQuery({
    queryKey: ["current-epoch"],
    queryFn: async () => {
      const res = await fetch("https://cardano-mainnet.blockfrost.io/api/v0/epochs/latest", {
        headers: { project_id: BLOCKFROST_KEY! },
      });
      if (!res.ok) throw new Error("Blockfrost error");
      const data = await res.json();
      return data?.epoch?.toString();
    },
    refetchInterval: 300000,
    staleTime: 300000,
    retry: 2,
  });

  const { data: adaPrice } = useQuery({
    queryKey: ["ada-price"],
    queryFn: async () => {
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd");
      const data = await res.json();
      return data?.cardano?.usd ? `$${Number(data.cardano.usd).toFixed(2)}` : null;
    },
    refetchInterval: 300000,
    staleTime: 300000,
    retry: 3,
    retryDelay: 1000,
  });

  const causesFund = paidToDelegates
    ? `${(Number(paidToDelegates.replace(" ₳", "").replace(/,/g, "")) * 0.05).toLocaleString(undefined, { maximumFractionDigits: 2 })} ₳`
    : "None";

  const communityContributors = poolInfo.owners.length;

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4 tracking-wide">C2VN STATS</h2>
        <div className="flex flex-wrap gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {paidToDelegates ?? "None"} <span className="align-super text-sm sm:text-lg">₳</span>
            </div>
            <div className="text-sm sm:text-base text-white/80">Paid to Delegates</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{delegates}</div>
            <div className="text-sm sm:text-base text-white/80">Delegates</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {causesFund} <span className="align-super text-sm sm:text-lg">₳</span>
            </div>
            <div className="text-sm sm:text-base text-white/80">Causes Fund</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{stakedWithC2VN}</div>
            <div className="text-sm sm:text-base text-white/80">Staked with C2VN</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {foundersPledge} <span className="align-super text-sm sm:text-lg">₳</span>
            </div>
            <div className="text-sm sm:text-base text-white/80">Founders Pledge</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{communityContributors}</div>
            <div className="text-sm sm:text-base text-white/80">Community Contributors</div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8">
          <div className="text-2xl sm:text-3xl font-bold text-white">{blocksMinted}</div>
          <div className="text-sm sm:text-base text-white/80">
            Lifetime
            <br />
            Blocks
          </div>
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
            <div className="text-2xl sm:text-3xl font-bold text-white">1,339</div>
            <div className="text-sm sm:text-base text-white/80">Total Pools</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{currentEpoch ?? "None"}</div>
            <div className="text-sm sm:text-base text-white/80">Current Epoch</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{adaPrice || "$0.00"}</div>
            <div className="text-sm sm:text-base text-white/80">Price USD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
