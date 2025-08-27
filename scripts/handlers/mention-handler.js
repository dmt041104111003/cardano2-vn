const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MentionHandler {
  constructor(server) {
    this.server = server;
  }

     async handleMentionSearch(clientId, message) {
     try {
       const { query, limit = 10, offset = 0, isLoadMore = false } = message;
       const actualLimit = isLoadMore ? 5 : limit;
        let whereCondition;
      
             if (!query || query.trim().length === 0) {
         whereCondition = {}; 
       } else {
         whereCondition = {
           OR: [
             { name: { contains: query, mode: 'insensitive' } },
             { email: { contains: query, mode: 'insensitive' } },
             { wallet: { contains: query, mode: 'insensitive' } },
           ],
         };
       }
        const users = await prisma.user.findMany({
         where: whereCondition,
         select: {
           id: true,
           name: true,
           email: true,
           wallet: true,
           image: true,
           provider: true,
           isBanned: true,
         },
         take: actualLimit,
         skip: offset,
         orderBy: [
           { name: 'asc' },
           { createdAt: 'desc' },
         ],
       });

        const formattedUsers = users.map(user => ({
         id: user.id,
         name: user.name || user.email || user.wallet || 'Unknown User',
         email: user.email,
         wallet: user.wallet,
         image: user.image,
         provider: user.provider,
         isBanned: user.isBanned || false,
         displayName: user.name || user.email || user.wallet || 'Unknown User',
         searchText: `${user.name || ''} ${user.email || ''} ${user.wallet || ''}`.trim(),
       }));

      const client = this.server.clients.get(clientId);
      if (client && client.ws) {
               this.server.sendMessage(client.ws, {
         type: 'mention_search_result',
         results: formattedUsers,
         query: query,
         offset: offset,
         hasMore: formattedUsers.length === actualLimit,
         timestamp: new Date().toISOString(),
       });
      } else {
      }

    } catch (error) {
      const client = this.server.clients.get(clientId);
      if (client && client.ws) {
        this.server.sendError(client.ws, 'Failed to search mentions');
      }
    }
  }

  async processMentions(content, postId, commentId, mentionedBy) {
    try {
      const mentionRegex = /@\[([^:]+):([^\]]+)\]|@([a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF\u0400-\u04FF\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0800-\u083F\u0840-\u085F\u0860-\u086F\u0870-\u089F\u08A0-\u08FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u18B0-\u18FF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1A20-\u1AAF\u1AB0-\u1AFF\u1B00-\u1B7F\u1B80-\u1BBF\u1BC0-\u1BFF\u1C00-\u1C4F\u1C50-\u1C7F\u1C80-\u1CBF\u1CC0-\u1CCF\u1CD0-\u1CFF\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u2000-\u206F\u2070-\u209F\u20A0-\u20CF\u20D0-\u20FF\u2100-\u214F\u2150-\u218F\u2190-\u21FF\u2200-\u22FF\u2300-\u23FF\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2DE0-\u2DFF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FE0-\u2FEF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31A0-\u31BF\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA4D0-\uA4FF\uA500-\uA63F\uA640-\uA69F\uA6A0-\uA6FF\uA700-\uA71F\uA720-\uA7FF\uA800-\uA82F\uA830-\uA83F\uA840-\uA87F\uA880-\uA8DF\uA8E0-\uA8FF\uA900-\uA92F\uA930-\uA95F\uA960-\uA97F\uA980-\uA9DF\uA9E0-\uA9FF\uAA00-\uAA5F\uAA60-\uAA7F\uAA80-\uAADF\uAAE0-\uAAFF\uAB00-\uAB2F\uAB30-\uAB6F\uAB70-\uABBF\uABC0-\uABFF\uAC00-\uD7AF\uD7B0-\uD7FF\uD800-\uDB7F\uDB80-\uDBFF\uDC00-\uDFFF\uE000-\uF8FF\uF900-\uFAFF\uFB00-\uFB4F\uFB50-\uFDFF\uFE00-\uFE0F\uFE10-\uFE1F\uFE20-\uFE2F\uFE30-\uFE4F\uFE50-\uFE6F\uFE70-\uFEFF\uFF00-\uFFEF\uFFF0-\uFFFF]+)/g;
      
      const mentions = [];
      let match;
      
      while ((match = mentionRegex.exec(content)) !== null) {
        let userId, userName;
        
        if (match[1] && match[2]) {
          userId = match[1];
          userName = match[2];
        } else if (match[3]) {
          userName = match[3];
          const user = await prisma.user.findFirst({
            where: {
              AND: [
                {
                  OR: [
                    { name: { equals: userName, mode: 'insensitive' } },
                    { email: { equals: userName, mode: 'insensitive' } },
                    { wallet: { equals: userName, mode: 'insensitive' } },
                  ],
                },
                { isBanned: false },
              ],
            },
            select: { id: true, name: true },
          });
          
          if (user) {
            userId = user.id;
          }
        }
        
        if (userId && userId !== mentionedBy) {
          mentions.push({ userId, userName });
        }
      }

      for (const mention of mentions) {
        const post = await prisma.post.findUnique({
          where: { id: postId },
          select: { slug: true, title: true },
        });

        await this.server.commentHandler.createNotification({
          userId: mention.userId,
          type: 'mention',
          title: 'You were mentioned',
          message: `Someone mentioned you in a comment`,
          data: {
            postId: postId,
            postSlug: post?.slug,
            commentId: commentId,
            mentionedBy: mentionedBy,
          },
        });
      }

      return mentions;
    } catch (error) {
      return [];
    }
  }
}

module.exports = MentionHandler;
