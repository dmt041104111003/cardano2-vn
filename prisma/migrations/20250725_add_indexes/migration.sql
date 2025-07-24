-- Migration: add_indexes for performance optimization

-- User
CREATE INDEX IF NOT EXISTS idx_user_createdAt ON "User"("createdAt");

-- Post
CREATE INDEX IF NOT EXISTS idx_post_status ON "Post"("status");
CREATE INDEX IF NOT EXISTS idx_post_authorId ON "Post"("authorId");
CREATE INDEX IF NOT EXISTS idx_post_createdAt ON "Post"("createdAt");

-- Media
CREATE INDEX IF NOT EXISTS idx_media_type ON "Media"("type");
CREATE INDEX IF NOT EXISTS idx_media_uploadedBy ON "Media"("uploadedBy");
CREATE INDEX IF NOT EXISTS idx_media_uploadedAt ON "Media"("uploadedAt");

-- Tag
CREATE INDEX IF NOT EXISTS idx_tag_name ON "Tag"("name");

-- Comment
CREATE INDEX IF NOT EXISTS idx_comment_postId ON "Comment"("postId");
CREATE INDEX IF NOT EXISTS idx_comment_userId ON "Comment"("userId");
CREATE INDEX IF NOT EXISTS idx_comment_createdAt ON "Comment"("createdAt"); 