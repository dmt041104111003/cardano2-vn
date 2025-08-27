"use client";

import { useState, useEffect, useRef } from 'react';
import { MentionUser } from '~/lib/mention-utils';

interface MentionAutocompleteProps {
  isVisible: boolean;
  query: string;
  onSelect: (user: MentionUser) => void;
  onClose: () => void;
  position: { x: number; y: number };
  inputWidth?: number;
}

export default function MentionAutocomplete({
  isVisible,
  query,
  onSelect,
  onClose,
  position,
  inputWidth
}: MentionAutocompleteProps) {
  const [users, setUsers] = useState<MentionUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:4001'}?postId=mention-search`);
    
    ws.onopen = () => {
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        if (message.type === 'mention_search_result') {
           const results = message.results || [];
           
           if (message.offset === 0) {
             setUsers(results);
             setOffset(results.length);
             
             const firstNonBannedIndex = results.findIndex((user: MentionUser) => !user.isBanned);
             setSelectedIndex(firstNonBannedIndex >= 0 ? firstNonBannedIndex : 0);
           } else {
             setUsers(prev => [...prev, ...results]);
             setOffset(prev => prev + results.length);
           }
           
           setHasMore(message.hasMore);
           setLoading(false);
           setLoadingMore(false);
         }
      } catch (error) {
      }
    };

    ws.onerror = (error) => {
      setLoading(false);
    };

    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [isVisible]);

     const sendSearchRequest = (isLoadMore = false) => {
     if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
       if (isLoadMore) {
         setLoadingMore(true);
       } else {
         setLoading(true);
         setOffset(0);
       }
       
        const searchMessage = {
           type: 'mention_search',
           query: query || "", 
           limit: 10,
           offset: isLoadMore ? offset : 0,
           isLoadMore: isLoadMore
         };
       wsRef.current.send(JSON.stringify(searchMessage));
     } else {
       setTimeout(() => sendSearchRequest(isLoadMore), 100);
     }
   };

   useEffect(() => {
     if (!isVisible) {
       setUsers([]);
       setSelectedIndex(0);
       setOffset(0);
       setHasMore(true);
       return;
     }

     sendSearchRequest();
   }, [query, isVisible]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || users.length === 0) return;

             switch (e.key) {
         case 'ArrowDown':
           e.preventDefault();
           setSelectedIndex(prev => {
             let nextIndex = (prev + 1) % users.length;
             while (users[nextIndex]?.isBanned && nextIndex !== prev) {
               nextIndex = (nextIndex + 1) % users.length;
             }
             return nextIndex;
           });
           break;
         case 'ArrowUp':
           e.preventDefault();
           setSelectedIndex(prev => {
             let nextIndex = (prev - 1 + users.length) % users.length;
             while (users[nextIndex]?.isBanned && nextIndex !== prev) {
               nextIndex = (nextIndex - 1 + users.length) % users.length;
             }
             return nextIndex;
           });
           break;
         case 'Enter':
           e.preventDefault();
           if (users[selectedIndex] && !users[selectedIndex].isBanned) {
             onSelect(users[selectedIndex]);
           }
           break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, users, selectedIndex, onSelect, onClose]);

     useEffect(() => {
     const handleClickOutside = (e: MouseEvent) => {
       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
         onClose();
       }
     };

     const handleScroll = (e: Event) => {
       const target = e.target as HTMLElement;
       if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
         if (hasMore && !loadingMore && !loading) {
           sendSearchRequest(true);
         }
       }
     };

     if (isVisible) {
       document.addEventListener('mousedown', handleClickOutside);
       if (dropdownRef.current) {
         dropdownRef.current.addEventListener('scroll', handleScroll);
       }
     }

     return () => {
       document.removeEventListener('mousedown', handleClickOutside);
       if (dropdownRef.current) {
         dropdownRef.current.removeEventListener('scroll', handleScroll);
       }
     };
   }, [isVisible, onClose, hasMore, loadingMore, loading]);

  if (!isVisible) {
    return null;
  }
  
  
  return (
    <>
      {/* Debug element to confirm rendering */}
      {/* <div 
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y - 20,
          width: '10px',
          height: '10px',
          backgroundColor: 'red',
          zIndex: 10000,
        }}
        title="Debug: Dropdown should be below this red dot"
      /> */}
      
        <div
          ref={dropdownRef}
          className="absolute z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto scrollbar-hide"
          style={{
            left: position.x,
            top: position.y,
            position: 'absolute',
            zIndex: 9999,
            width: inputWidth ? `${inputWidth}px` : '100%',
            minWidth: '300px',
          }}
        >
             {loading ? (
         <div className="py-1">
           {Array.from({ length: 5 }).map((_, index) => (
             <div key={index} className="px-3 py-2 flex items-center gap-3">
               <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
               <div className="flex-1">
                 <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                 <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-2/3"></div>
               </div>
             </div>
           ))}
         </div>
       ) : users.length === 0 ? (
         <div className="p-3 text-center text-gray-500 dark:text-gray-400 text-sm">
           No users found
         </div>
                ) : (
           <div className="py-1">
             {users.map((user, index) => (
               <button
                 key={user.id}
                 className={`w-full px-3 py-2 text-left transition-colors flex items-center gap-3 ${
                   user.isBanned 
                     ? 'text-red-500 dark:text-red-400 cursor-not-allowed opacity-60' 
                     : 'hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                 } ${
                   index === selectedIndex && !user.isBanned ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                 }`}
                 onClick={() => !user.isBanned && onSelect(user)}
                 disabled={user.isBanned}
               >
                 <div className="flex-shrink-0">
                   {user.image ? (
                     <img
                       src={user.image}
                       alt={user.displayName}
                       className="w-6 h-6 rounded-full object-cover"
                     />
                   ) : (
                     <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                       {user.displayName.charAt(0).toUpperCase()}
                     </div>
                   )}
                 </div>
                 <div className="flex-1 min-w-0">
                   <div className="font-medium text-gray-900 dark:text-white truncate flex items-center gap-2">
                     {user.displayName}
                     {user.isBanned && (
                       <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-medium">
                         BANNED
                       </span>
                     )}
                   </div>
                   <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                     {user.email && user.email !== user.displayName ? user.email : user.wallet || user.provider}
                   </div>
                 </div>
               </button>
             ))}
             
                           {loadingMore && (
                <div className="py-1">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={`loading-more-${index}`} className="px-3 py-2 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
             
             {!hasMore && users.length > 0 && (
               <div className="p-2 text-center text-gray-400 dark:text-gray-500 text-xs">
                 No more users
               </div>
             )}
           </div>
         )}
       </div>
     </>
   );
 }
