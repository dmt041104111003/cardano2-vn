export const REACTION_ICONS = {
  like: "👍",
  love: "❤️", 
  haha: "😂",
  wow: "😮",
  sad: "😢",
  angry: "😠"
};

export const REACTION_DETAILS = [
  { type: 'like', icon: '👍', label: 'Like' },
  { type: 'love', icon: '❤️', label: 'Love' },
  { type: 'haha', icon: '😂', label: 'Haha' },
  { type: 'wow', icon: '😮', label: 'Wow' },
  { type: 'sad', icon: '😢', label: 'Sad' },
  { type: 'angry', icon: '😠', label: 'Angry' }
];

export interface ReactionUser {
  id: string;
  name: string;
  avatar: string;
  reaction: string;
  time: string;
}

export const REACTION_USERS: ReactionUser[] = [
  { id: "1", name: "Sarah Wilson", avatar: "from-blue-500 to-purple-600", reaction: "👍", time: "Just now" },
  { id: "2", name: "Mike Johnson", avatar: "from-green-500 to-teal-600", reaction: "❤️", time: "2 minutes ago" },
  { id: "3", name: "Emma Davis", avatar: "from-pink-500 to-rose-600", reaction: "👍", time: "5 minutes ago" },
  { id: "4", name: "Alex Chen", avatar: "from-purple-500 to-indigo-600", reaction: "😂", time: "10 minutes ago" },
  { id: "5", name: "Lisa Garcia", avatar: "from-orange-500 to-red-600", reaction: "❤️", time: "15 minutes ago" },
  { id: "6", name: "David Lee", avatar: "from-yellow-500 to-orange-600", reaction: "👍", time: "20 minutes ago" },
  { id: "7", name: "Sophie Anderson", avatar: "from-cyan-500 to-blue-600", reaction: "😮", time: "25 minutes ago" },
  { id: "8", name: "Kevin White", avatar: "from-emerald-500 to-green-600", reaction: "👍", time: "30 minutes ago" },
  { id: "9", name: "Maria Rodriguez", avatar: "from-violet-500 to-purple-600", reaction: "❤️", time: "35 minutes ago" },
  { id: "10", name: "James Brown", avatar: "from-red-500 to-pink-600", reaction: "👍", time: "40 minutes ago" },
  { id: "11", name: "Anna Smith", avatar: "from-indigo-500 to-purple-600", reaction: "😂", time: "45 minutes ago" },
  { id: "12", name: "Tom Wilson", avatar: "from-teal-500 to-cyan-600", reaction: "👍", time: "50 minutes ago" },
  { id: "13", name: "Emily Johnson", avatar: "from-rose-500 to-pink-600", reaction: "❤️", time: "55 minutes ago" },
  { id: "14", name: "Chris Davis", avatar: "from-orange-500 to-yellow-600", reaction: "😮", time: "1 hour ago" },
  { id: "15", name: "Rachel Chen", avatar: "from-green-500 to-emerald-600", reaction: "👍", time: "1 hour ago" },
];

export const REACTION_CONFIG = {
  initialUsers: 10,
  loadMoreCount: 3,
  loadingDelay: 1000,
  scrollThreshold: 0.8
}; 