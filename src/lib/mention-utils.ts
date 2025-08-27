
export interface MentionUser {
  id: string;
  name: string;
  email: string | null;
  wallet: string | null;
  image: string | null;
  provider: string | null;
  isBanned: boolean;
  displayName: string;
  searchText: string;
}

export function formatMentionText(text: string): string {
  return text.replace(/@\[([^:]+):([^\]]+)\]/g, (match, id, name) => {
    return `<span class="mention" data-user-id="${id}" data-user-name="${name}">@${name}</span>`;
  });
}

export function parseMentions(text: string): Array<{ id: string; name: string }> {
  const mentions: Array<{ id: string; name: string }> = [];
  const mentionRegex = /@\[([^:]+):([^\]]+)\]/g;
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      id: match[1],
      name: match[2]
    });
  }
  
  return mentions;
}

export function hasMentionTrigger(text: string, cursorPosition: number): boolean {
  const beforeCursor = text.substring(0, cursorPosition);
  return /@([^@]*)$/.test(beforeCursor);
}

export function extractMentionQuery(text: string, cursorPosition: number): string | null {
  const beforeCursor = text.substring(0, cursorPosition);
  const match = beforeCursor.match(/@([^@]*)$/);
  return match ? match[1] : "";
}

export function insertMention(
  text: string, 
  cursorPosition: number, 
  query: string, 
  user: MentionUser
): { newText: string; newCursorPosition: number; insertedMention: { id: string; name: string; displayName: string } } {
  const beforeMention = text.substring(0, cursorPosition - query.length - 1);
  const afterMention = text.substring(cursorPosition);
  
  const displayText = `@${user.displayName}`;
  
  const newText = beforeMention + displayText + ' ' + afterMention;
  const newCursorPosition = beforeMention.length + displayText.length + 1;
  
  return { 
    newText, 
    newCursorPosition, 
    insertedMention: { id: user.id, name: user.name || user.email || user.wallet || 'Unknown User', displayName: user.displayName } 
  };
}

export function formatMentionsForStorage(
  displayText: string, 
  selectedMentions: Array<{ id: string; name: string; displayName: string }>
): string {
  let formattedText = displayText;
  
  const sortedSelectedMentions = [...selectedMentions].sort((a, b) => b.displayName.length - a.displayName.length);

  sortedSelectedMentions.forEach(mention => {
    const escapedDisplayName = mention.displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`@${escapedDisplayName}(?=\\b|$)`, 'g');
    
    if (formattedText.includes(`@${mention.displayName}`)) {
      formattedText = formattedText.replace(regex, `@[${mention.id}:${mention.displayName}]`);
    }
  });

  return formattedText;
}

export function calculateMentionPosition(
  inputElement: HTMLInputElement,
  cursorPosition: number,
  text: string
): { x: number; y: number } {
  const textBeforeMention = text.substring(0, text.lastIndexOf('@', cursorPosition));
  const tempSpan = document.createElement('span');
  tempSpan.style.font = window.getComputedStyle(inputElement).font;
  tempSpan.style.visibility = 'hidden';
  tempSpan.style.position = 'absolute';
  tempSpan.style.whiteSpace = 'pre';
  tempSpan.textContent = textBeforeMention;
  document.body.appendChild(tempSpan);
  document.body.removeChild(tempSpan);
  
  return {
    x: 0, 
    y: inputElement.offsetHeight + 5
  };
}
