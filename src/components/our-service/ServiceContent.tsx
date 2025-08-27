import React from 'react';

export default function ServiceContent() {
  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      {/* SPO Section */}
      <div className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 ">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            SPO (Stake Pool Operator)
          </h4>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              By staking your ADA with our pool, you're not just earning rewards - you're supporting:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Vietnamese Cardano community development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Educational initiatives and workshops</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Local blockchain projects and startups</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Decentralized governance participation</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="https://pool.pm/d0f005a0a823b331583a5d0083f3745f39fd36ad13bbc0845e147892"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-white/50 px-6 lg:px-8 py-3 lg:py-4 font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm lg:text-base xl:text-lg"
              >
                View on Pool.pm
              </a>
              <a
                href="https://adapools.org/pool/d0f005a0a823b331583a5d0083f3745f39fd36ad13bbc0845e147892"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success bg-blue-600 dark:bg-white px-6 lg:px-8 py-3 lg:py-4 font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100 text-base lg:text-lg xl:text-xl"
              >
                Stake Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gray-300 dark:bg-gray-600 my-12"></div>

      {/* DREP Section */}
      <div className="mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 ">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            DREP (Delegated Representative)
          </h4>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Delegate your voting power to us and help shape the future of Cardano:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Vote on proposals that benefit the Vietnamese community</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Support educational and development initiatives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Participate in governance discussions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-600 dark:text-gray-300">•</span>
                <span>Help build a stronger Cardano ecosystem</span>
              </li>
            </ul>
            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href="https://sancho.network"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-success bg-blue-600 dark:bg-white px-6 lg:px-8 py-3 lg:py-4 font-semibold text-white dark:text-blue-900 shadow-xl hover:bg-blue-700 dark:hover:bg-gray-100 text-base lg:text-lg xl:text-xl"
              >
                Learn About DREP
              </a>
              <a
                href="https://t.me/cardano2vn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-white/50 px-6 lg:px-8 py-3 lg:py-4 font-semibold text-gray-900 dark:text-white shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-sm lg:text-base xl:text-lg"
              >
                Join Discussion
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Community Support Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Support Our Community
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Beyond staking and voting, there are many ways to support our mission:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="https://t.me/cardano2vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Join Discussions</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Participate in our community forums and Telegram groups
            </p>
          </a>
          <a
            href="https://github.com/cardano2vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Share Knowledge</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help educate others about Cardano and blockchain technology
            </p>
          </a>
          <a
            href="https://discord.gg/cardano2vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Build Projects</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Contribute to local Cardano projects and initiatives
            </p>
          </a>
          <a
            href="https://twitter.com/cardano2vn"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Spread the Word</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share our mission and services with your network
            </p>
          </a>
        </div>
      </div>

 
    </div>
    
  );
}
