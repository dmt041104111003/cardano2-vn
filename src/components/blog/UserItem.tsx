import { ReactionUser } from "../../constants/reactions";

interface UserItemProps {
  user: ReactionUser;
}

export default function UserItem({ user }: UserItemProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-all duration-200 group/item">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatar} flex items-center justify-center text-white font-semibold shadow-lg`}>
          {user.name.charAt(0)}
        </div>
        <div>
          <div className="text-white font-semibold">{user.name}</div>
          <div className="text-gray-400 text-sm flex items-center gap-1">
            <span>{user.reaction}</span>
            <span>•</span>
            <span>{user.time}</span>
          </div>
        </div>
      </div>
      <button className="text-blue-500 hover:text-blue-400 transition-colors text-sm font-medium opacity-0 group-hover/item:opacity-100">
        Message
      </button>
    </div>
  );
} 