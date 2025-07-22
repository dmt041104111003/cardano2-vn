export interface Comment {
  id: string;
  author: string;
  content: string;
  time: string;
  avatar: string;
  reactions: {
    like: number;
    love: number;
    haha: number;
    wow: number;
    sad: number;
    angry: number;
  };
  replies?: Comment[];
}

export const COMMENT_AVATARS = {
  BLUE: "from-blue-500 to-purple-600",
  GREEN: "from-green-500 to-teal-600", 
  PINK: "from-pink-500 to-rose-600",
  PURPLE: "from-purple-500 to-indigo-600",
  ORANGE: "from-orange-500 to-red-600",
  YELLOW: "from-yellow-500 to-orange-600",
  CYAN: "from-cyan-500 to-blue-600",
  EMERALD: "from-emerald-500 to-green-600",
  VIOLET: "from-violet-500 to-purple-600"
} as const;

export const DEMO_COMMENTS: Comment[] = [
  {
    id: "1",
    author: "Sarah Wilson",
    content: "This is exactly what I was looking for! The Cardano ecosystem is really growing fast. Thanks for sharing this comprehensive guide.",
    time: "2 hours ago",
    avatar: COMMENT_AVATARS.BLUE,
    reactions: {
      like: 12,
      love: 8,
      haha: 2,
      wow: 1,
      sad: 0,
      angry: 0
    },
    replies: [
      {
        id: "1-1",
        author: "Mike Johnson",
        content: "Totally agree! The ecosystem has come a long way. What's your favorite DEX on Cardano?",
        time: "1 hour ago",
        avatar: COMMENT_AVATARS.GREEN,
        reactions: {
          like: 3,
          love: 1,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "1-2",
        author: "Emma Davis",
        content: "Sarah, you should check out SundaeSwap! It's been my go-to for DeFi on Cardano.",
        time: "30 minutes ago",
        avatar: COMMENT_AVATARS.PINK,
        reactions: {
          like: 2,
          love: 0,
          haha: 1,
          wow: 0,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "1-3",
        author: "David Lee",
        content: "I've been using WingRiders lately. The UI is much cleaner than SundaeSwap.",
        time: "45 minutes ago",
        avatar: COMMENT_AVATARS.YELLOW,
        reactions: {
          like: 1,
          love: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "1-4",
        author: "Sophie Anderson",
        content: "Minswap is also great! The concentrated liquidity pools are a game-changer.",
        time: "40 minutes ago",
        avatar: COMMENT_AVATARS.ORANGE,
        reactions: {
          like: 4,
          love: 2,
          haha: 0,
          wow: 1,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "1-5",
        author: "Kevin White",
        content: "Don't forget about MuesliSwap! It's the OG DEX on Cardano.",
        time: "35 minutes ago",
        avatar: COMMENT_AVATARS.CYAN,
        reactions: {
          like: 2,
          love: 1,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "1-6",
        author: "Maria Rodriguez",
        content: "I love how all these DEXs are interoperable. You can use multiple ones seamlessly.",
        time: "30 minutes ago",
        avatar: COMMENT_AVATARS.EMERALD,
        reactions: {
          like: 3,
          love: 2,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      }
    ]
  },
  {
    id: "2", 
    author: "Mike Johnson",
    content: "Great article! I've been following Cardano for a while now and this really helps clarify some concepts. The DeFi space is evolving so quickly.",
    time: "4 hours ago",
    avatar: COMMENT_AVATARS.GREEN,
    reactions: {
      like: 5,
      love: 3,
      haha: 0,
      wow: 2,
      sad: 0,
      angry: 0
    },
    replies: [
      {
        id: "2-1",
        author: "Alex Chen",
        content: "Mike, have you tried the new CIP-68 tokens? They're game-changing for NFT standards.",
        time: "2 hours ago",
        avatar: COMMENT_AVATARS.PURPLE,
        reactions: {
          like: 4,
          love: 2,
          haha: 0,
          wow: 1,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "2-2",
        author: "Lisa Garcia",
        content: "The CIP-68 standard is revolutionary! It allows for much more complex NFT structures.",
        time: "1.5 hours ago",
        avatar: COMMENT_AVATARS.ORANGE,
        reactions: {
          like: 3,
          love: 1,
          haha: 0,
          wow: 2,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "2-3",
        author: "Kevin White",
        content: "I'm still learning about CIP-68. Can you recommend any good resources?",
        time: "1 hour ago",
        avatar: COMMENT_AVATARS.CYAN,
        reactions: {
          like: 2,
          love: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "2-4",
        author: "Sophie Anderson",
        content: "The Cardano documentation has great examples. Also check out the community forums.",
        time: "45 minutes ago",
        avatar: COMMENT_AVATARS.ORANGE,
        reactions: {
          like: 1,
          love: 1,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      }
    ]
  },
  {
    id: "3",
    author: "Emma Davis", 
    content: "LOL, I remember when people said Cardano was just a 'ghost chain'. Look at it now! This is the future of DeFi. The way Cardano has evolved over the past few years is absolutely incredible. From being called a 'ghost chain' to becoming one of the most innovative blockchain platforms in the space. The peer-reviewed approach, the Ouroboros consensus mechanism, and the focus on sustainability have really set it apart from other blockchains. I've been following the development since the beginning and it's amazing to see how far we've come. The DeFi ecosystem is growing rapidly with projects like SundaeSwap, WingRiders, and Minswap leading the charge. The NFT space is also thriving with projects like SpaceBudz and Clay Nation. And let's not forget about the governance system with Project Catalyst. It's truly a comprehensive ecosystem that puts users first. The best part is that it's all built on solid academic foundations, which gives me confidence in its long-term viability. I can't wait to see what the future holds for Cardano!",
    time: "6 hours ago",
    avatar: COMMENT_AVATARS.PINK,
    reactions: {
      like: 8,
      love: 15,
      haha: 23,
      wow: 4,
      sad: 0,
      angry: 0
    },
    replies: [
      {
        id: "3-1",
        author: "David Lee",
        content: "Emma, you're absolutely right! The academic approach is what makes Cardano special. I love how they publish peer-reviewed papers before implementing features. It's such a refreshing change from the 'move fast and break things' mentality of other chains.",
        time: "4 hours ago",
        avatar: COMMENT_AVATARS.YELLOW,
        reactions: {
          like: 5,
          love: 3,
          haha: 0,
          wow: 1,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "3-2",
        author: "Sophie Anderson",
        content: "The governance system is revolutionary! Project Catalyst has given the community real power to decide the future of the platform. I've participated in several funding rounds and it's amazing to see grassroots projects getting funded. This is true decentralization in action.",
        time: "3 hours ago",
        avatar: COMMENT_AVATARS.ORANGE,
        reactions: {
          like: 7,
          love: 4,
          haha: 1,
          wow: 2,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "3-3",
        author: "Kevin White",
        content: "The peer-reviewed approach is what sets Cardano apart. Every feature is thoroughly researched before implementation.",
        time: "2.5 hours ago",
        avatar: COMMENT_AVATARS.CYAN,
        reactions: {
          like: 3,
          love: 2,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "3-4",
        author: "Maria Rodriguez",
        content: "I love how transparent the development process is. You can follow every decision and understand the reasoning behind it.",
        time: "2 hours ago",
        avatar: COMMENT_AVATARS.EMERALD,
        reactions: {
          like: 4,
          love: 1,
          haha: 0,
          wow: 1,
          sad: 0,
          angry: 0
        }
      },
      {
        id: "3-5",
        author: "James Brown",
        content: "The academic rigor really shows in the quality of the code. Much more reliable than other chains.",
        time: "1.5 hours ago",
        avatar: COMMENT_AVATARS.VIOLET,
        reactions: {
          like: 2,
          love: 1,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0
        }
      }
    ]
  },
  {
    id: "4",
    author: "Alex Chen",
    content: "The technical details in this post are spot on. I'm particularly interested in the CIP-68 implementation. Can't wait to see more developments!",
    time: "8 hours ago", 
    avatar: COMMENT_AVATARS.PURPLE,
    reactions: {
      like: 3,
      love: 1,
      haha: 0,
      wow: 0,
      sad: 0,
      angry: 0
    }
  },
  {
    id: "5",
    author: "Lisa Garcia",
    content: "This is revolutionary! The way Cardano handles smart contracts is so much more secure than other platforms. Great breakdown of the ecosystem.",
    time: "1 day ago",
    avatar: COMMENT_AVATARS.ORANGE, 
    reactions: {
      like: 7,
      love: 12,
      haha: 1,
      wow: 3,
      sad: 0,
      angry: 0
    }
  }
]; 