export function scrollToComment(commentId: string, highlightDuration: number = 2000) {
  const commentElement = document.getElementById(`comment-${commentId}`);
  
  if (commentElement) {
    commentElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
    commentElement.classList.add('bg-yellow-100', 'dark:bg-yellow-900/20', 'border-l-4', 'border-yellow-500');
    setTimeout(() => {
      commentElement.classList.remove('bg-yellow-100', 'dark:bg-yellow-900/20', 'border-l-4', 'border-yellow-500');
    }, highlightDuration);
    
    return true;
  }
  
  return false;
}

export function scrollToCommentWithRetry(commentId: string, maxRetries: number = 3, retryDelay: number = 500) {
  if (scrollToComment(commentId)) {
    return true;
  }
  
  let retryCount = 0;
  const retry = () => {
    retryCount++;
    if (retryCount > maxRetries) {
      console.warn(`Failed to scroll to comment ${commentId} after ${maxRetries} retries`);
      return false;
    }
    
    setTimeout(() => {
      if (!scrollToComment(commentId)) {
        retry();
      }
    }, retryDelay);
  };
  
  retry();
  return false;
}

export function highlightMentionedUser(userId: string, highlightDuration: number = 2000) {
  const userElements = document.querySelectorAll(`[data-user-id="${userId}"]`);
  
  userElements.forEach(element => {
    element.classList.add('bg-blue-100', 'dark:bg-blue-900/20', 'rounded');
    
    setTimeout(() => {
      element.classList.remove('bg-blue-100', 'dark:bg-blue-900/20', 'rounded');
    }, highlightDuration);
  });
}
