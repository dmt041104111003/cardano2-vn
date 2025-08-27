"use client";

import { parseMentions } from '~/lib/mention-utils';

interface MentionDisplayProps {
  content: string;
  className?: string;
}

export default function MentionDisplay({ content, className = "" }: MentionDisplayProps) {
  const mentions = parseMentions(content);
  
  const formatContent = () => {
    let formattedContent = content;
    mentions.forEach(mention => {
      const mentionPattern = `@[${mention.id}:${mention.name}]`;
      const replacement = `<span class="mention" data-user-id="${mention.id}" data-user-name="${mention.name}">@${mention.name}</span>`;
      formattedContent = formattedContent.replace(mentionPattern, replacement);
    });
    
    return formattedContent;
  };

  return (
    <span 
      className={className}
      dangerouslySetInnerHTML={{ __html: formatContent() }}
    />
  );
}
