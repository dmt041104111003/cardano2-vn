import NextAuth from "next-auth/next";
import { prisma } from "~/lib/prisma"
import { CardanoWalletProvider } from "~/lib/cardano-auth-provider"
import { generateWalletAvatar } from '~/lib/wallet-avatar';
import cloudinary from '~/lib/cloudinary';

interface TokenWithAddress extends Record<string, unknown> {
  address?: string;
}

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CardanoWalletProvider(),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
  },
  callbacks: {
    async redirect({ baseUrl }: { baseUrl: string }) {
      return baseUrl
    },
    async jwt(params: unknown) {
      const { token, user, account } = params as {
        token: Record<string, unknown>;
        user?: { address?: string };
        account?: { provider?: string };
      };
      if (user && account?.provider === "cardano-wallet") {
        (token as TokenWithAddress).address = user.address;
      }
      return token;
    },
    async session(params: unknown) {
      const { session, token } = params as { session: import("next-auth").Session & { expires?: string }; token: Record<string, unknown> };
      if (typeof session.user === 'object' && session.user) {
        (session.user as Record<string, unknown> & { address?: string }).address = (token as TokenWithAddress).address;
      }
      if (!session.expires) {
        session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 ngày
      }
      return { ...session, expires: session.expires! };
    },
    async signIn(params: unknown) {
      const { user, account } = params as {
        user: { address: string; name?: string; image?: string };
        account: { provider?: string };
      };
      if (account?.provider === "cardano-wallet") {
        try {
          let dbUser = await prisma.user.findUnique({
            where: { wallet: user.address },
            include: { role: true }
          });

          if (!dbUser) {
            const userRole = await prisma.role.findFirst({ 
              where: { name: "USER" } 
            });
            
            if (!userRole) {
              throw new Error("Role USER not exist");
            }

            let avatar: string | null = user.image || null;
            if (!avatar && user.address) {
              const dataImage = generateWalletAvatar(user.address);
              const uploadRes = await cloudinary.uploader.upload(dataImage, { resource_type: 'image' });
              avatar = uploadRes.url;
            } else if (avatar && avatar.startsWith('data:image')) {
              const uploadRes = await cloudinary.uploader.upload(avatar, { resource_type: 'image' });
              avatar = uploadRes.url;
            }

            dbUser = await prisma.user.create({
              data: {
                wallet: user.address,
                name: user.name || null,
                image: avatar,
                roleId: userRole.id,
              },
              include: { role: true }
            });
            
            console.log("[NextAuth] New Cardano Wallet user created:", dbUser.wallet);
          } else {
            if (dbUser && !dbUser.image && dbUser.wallet) {
              const dataImage = generateWalletAvatar(dbUser.wallet);
              const uploadRes = await cloudinary.uploader.upload(dataImage, { resource_type: 'image' });
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { image: uploadRes.url },
              });
            } else if (dbUser && dbUser.image && dbUser.image.startsWith('data:image')) {
              const uploadRes = await cloudinary.uploader.upload(dbUser.image, { resource_type: 'image' });
              await prisma.user.update({
                where: { id: dbUser.id },
                data: { image: uploadRes.url },
              });
            }
            console.log("[NextAuth] Existing Cardano Wallet user signed in:", dbUser.wallet);
          }

          const existingSession = await prisma.session.findFirst({
            where: { userId: dbUser.id }
          });

          if (existingSession) {
            await prisma.session.update({
              where: { id: existingSession.id },
              data: { lastAccess: new Date() }
            });
            console.log("[NextAuth] Session lastAccess updated for user:", dbUser.wallet);
          } else {
            await prisma.session.create({
              data: {
                userId: dbUser.id,
                accessTime: new Date(),
                lastAccess: new Date(),
              }
            });
            console.log("[NextAuth] New session created for user:", dbUser.wallet);
          }
          
          return true;
        } catch (e) {
          console.error(e);
          return false;
        }
      }
      return true;
    },
    async signOut({ token }: { token: Record<string, unknown> }) {
      try {
        const address = (token as TokenWithAddress).address;
        if (address) {
          const user = await prisma.user.findUnique({
            where: { wallet: address as string }
          });
          
          if (user) {
            await prisma.session.deleteMany({
              where: { userId: user.id }
            });
            console.log("[NextAuth] Sessions deleted from database for user:", user.wallet);
          }
        }
      } catch (error) {
        console.error("[NextAuth] Error in signOut callback:", error);
      }
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 