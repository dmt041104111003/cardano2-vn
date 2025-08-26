import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CountUp from 'react-countup';

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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const communityContributors = poolInfo?.owners.length.toLocaleString() ?? "None";

  return (
    <div ref={sectionRef} className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4 tracking-wide">C2VN STATS</h2>
        <div className="flex flex-wrap gap-x-6 sm:gap-x-12 gap-y-3 sm:gap-y-4">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && paidToDelegates ? (
                <CountUp
                  end={parseFloat(paidToDelegates.replace(" ₳", "").replace(/,/g, ""))}
                  duration={2.5}
                  delay={0}
                  decimals={2}
                  suffix=" ₳"
                />
              ) : (
                paidToDelegates ?? "None"
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Paid to Delegates</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && delegates !== "None" ? (
                <CountUp
                  end={parseInt(delegates.replace(/,/g, ""))}
                  duration={2.5}
                  delay={0.2}
                />
              ) : (
                delegates
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Delegates</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && causesFund !== "None" ? (
                <CountUp
                  end={parseFloat(causesFund.replace(" ₳", "").replace(/,/g, ""))}
                  duration={2.5}
                  delay={0.4}
                  decimals={2}
                  suffix=" ₳"
                />
              ) : (
                causesFund
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Causes Fund</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && stakedWithC2VN !== "None" ? (
                <CountUp
                  end={parseFloat(stakedWithC2VN.replace(" ₳", "").replace(/,/g, ""))}
                  duration={2.5}
                  delay={0.6}
                  decimals={2}
                  suffix=" ₳"
                />
              ) : (
                stakedWithC2VN
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Staked with C2VN</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && foundersPledge !== "None" ? (
                <CountUp
                  end={parseFloat(foundersPledge.replace(" ₳", "").replace(/,/g, ""))}
                  duration={2.5}
                  delay={0.8}
                  decimals={2}
                  suffix=" ₳"
                />
              ) : (
                foundersPledge
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Founders Pledge</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && communityContributors !== "None" ? (
                <CountUp
                  end={parseInt(communityContributors.replace(/,/g, ""))}
                  duration={2.5}
                  delay={1.0}
                />
              ) : (
                communityContributors
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Community Contributors</div>
          </div>
        </div>
        <div className="mt-6 sm:mt-8">
          <div className="text-2xl sm:text-3xl font-bold text-white">
            {isVisible && blocksMinted !== "None" ? (
              <CountUp
                end={parseInt(blocksMinted.replace(/,/g, ""))}
                duration={2.5}
                delay={1.2}
              />
            ) : (
              blocksMinted
            )}
          </div>
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
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible ? (
                <CountUp
                  end={1683196}
                  duration={2.5}
                  delay={1.4}
                />
              ) : (
                "1,683,196"
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Total Staked Addresses</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible ? (
                <CountUp
                  end={1339}
                  duration={2.5}
                  delay={1.6}
                />
              ) : (
                "1,339"
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Total Pools</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && currentEpoch ? (
                <CountUp
                  end={parseInt(currentEpoch)}
                  duration={2.5}
                  delay={1.8}
                />
              ) : (
                currentEpoch ?? "None"
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Current Epoch</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {isVisible && adaPrice ? (
                <CountUp
                  end={parseFloat(adaPrice.replace("$", ""))}
                  duration={2.5}
                  delay={2.0}
                  decimals={2}
                  prefix="$"
                />
              ) : (
                adaPrice || "$0.00"
              )}
            </div>
            <div className="text-sm sm:text-base text-white/80">Price USD</div>
          </div>
        </div>
      </div>
    </div>
  );
}
