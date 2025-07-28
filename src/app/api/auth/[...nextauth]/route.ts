import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
    }),
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
        user?: { address?: string; email?: string; image?: string; name?: string };
        account?: { provider?: string };
      };
      if (user && account?.provider === "cardano-wallet") {
        (token as TokenWithAddress).address = user.address;
      }
      if (user && account?.provider === "google") {
        console.log("[NextAuth] Google user data in JWT:", user);
        token.email = user.email;
        token.provider = "google";
        token.image = user.image;
        token.name = user.name;
        console.log("[NextAuth] Token after Google update:", token);
      }
      return token;
    },
    async session(params: unknown) {
      const { session, token } = params as { session: import("next-auth").Session & { expires?: string }; token: Record<string, unknown> };
      if (typeof session.user === 'object' && session.user) {
        (session.user as Record<string, unknown> & { address?: string }).address = (token as TokenWithAddress).address;
        if (token.provider === "google") {
          (session.user as Record<string, unknown> & { email?: string }).email = token.email as string;
          
          // Get user data from database for Google users
          try {
            console.log("[NextAuth] Looking for user with email:", token.email);
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email as string },
              select: { image: true, name: true }
            });
            console.log("[NextAuth] Found DB user:", dbUser);
            
            if (dbUser && dbUser.image) {
              session.user.image = dbUser.image;
              console.log("[NextAuth] Updated session with DB image:", dbUser.image);
            } else {
              console.log("[NextAuth] No image found in DB, using token image:", token.image);
              session.user.image = token.image as string;
            }
            
            if (dbUser && dbUser.name) {
              session.user.name = dbUser.name;
            } else {
              session.user.name = token.name as string;
            }
          } catch (error) {
            console.error("[NextAuth] Error fetching user data for session:", error);
            session.user.image = token.image as string;
            session.user.name = token.name as string;
          }
        }
      }
      if (!session.expires) {
        session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 ngày
      }
      console.log("[NextAuth] Final session user:", session.user);
      console.log("[NextAuth] Session user image:", session.user?.image);
      console.log("[NextAuth] Session user name:", session.user?.name);
      return { ...session, expires: session.expires! };
    },
    async signIn(params: unknown) {
      const { user, account } = params as {
        user: { address?: string; email?: string; name?: string; image?: string };
        account: { provider?: string };
      };
      
      if (account?.provider === "google") {
        try {
          let retries = 3;
          while (retries > 0) {
            try {
              await prisma.$connect();
              break;
            } catch (connectError) {
              retries--;
              if (retries === 0) {
                console.error("[NextAuth] Failed to connect to database after 3 retries:", connectError);
                return true;
              }
              console.warn(`[NextAuth] Database connection failed, retrying... (${retries} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { role: true }
          });

          if (!dbUser) {
            const userRole = await prisma.role.findFirst({
              where: { name: "ADMIN" }
            });
            
            if (!userRole) {
              throw new Error("Role ADMIN not exist");
            }

            let avatar: string | null = user.image || null;
            if (avatar && avatar.startsWith('https://lh3.googleusercontent.com')) {
              try {
                const uploadRes = await cloudinary.uploader.upload(avatar, { 
                  resource_type: 'image',
                  folder: 'google-avatars'
                });
                avatar = uploadRes.url;
                console.log("[NextAuth] Uploaded Google image to Cloudinary:", avatar);
              } catch (uploadError) {
                console.error("[NextAuth] Failed to upload Google image to Cloudinary:", uploadError);
                avatar = user.image; 
              }
            }

            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || null,
                image: avatar,
                provider: "google",
                roleId: userRole.id,
              },
              include: { role: true }
            });
            
            console.log("[NextAuth] New Google user created:", dbUser.email);
          } else {
            console.log("[NextAuth] Existing Google user signed in:", dbUser.email);
            
            if (dbUser.image !== user.image || dbUser.name !== user.name) {
              let avatar: string | null = user.image || dbUser.image;
              if (user.image && user.image.startsWith('https://lh3.googleusercontent.com') && user.image !== dbUser.image) {
                try {
                  const uploadRes = await cloudinary.uploader.upload(user.image, { 
                    resource_type: 'image',
                    folder: 'google-avatars'
                  });
                  avatar = uploadRes.url;
                  console.log("[NextAuth] Updated Google image in Cloudinary:", avatar);
                } catch (uploadError) {
                  console.error("[NextAuth] Failed to update Google image in Cloudinary:", uploadError);
                  avatar = user.image;
                }
              }
              
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  name: user.name || dbUser.name,
                  image: avatar,
                }
              });
            }
          }

          const existingSession = await prisma.session.findFirst({
            where: { userId: dbUser.id }
          });

          if (existingSession) {
            await prisma.session.update({
              where: { id: existingSession.id },
              data: { lastAccess: new Date() }
            });
            console.log("[NextAuth] Session lastAccess updated for user:", dbUser.email);
          } else {
            await prisma.session.create({
              data: {
                userId: dbUser.id,
                accessTime: new Date(),
                lastAccess: new Date(),
              }
            });
            console.log("[NextAuth] New session created for user:", dbUser.email);
          }
          
          return true;
        } catch (e) {
          console.error("[NextAuth] Database error during Google signIn:", e);
          
          if (e instanceof Error && e.message.includes("Can't reach database server")) {
            console.warn("[NextAuth] Database server unreachable, allowing authentication without DB operations");
            return true;
          }
          
          return false;
        }
      }
      
      if (account?.provider === "cardano-wallet") {
        try {
          let retries = 3;
          while (retries > 0) {
            try {
              await prisma.$connect();
              break;
            } catch (connectError) {
              retries--;
              if (retries === 0) {
                console.error("[NextAuth] Failed to connect to database after 3 retries:", connectError);
                return true;
              }
              console.warn(`[NextAuth] Database connection failed, retrying... (${retries} attempts left)`);
              await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
            }
          }
          
          let dbUser = await prisma.user.findUnique({
            where: { wallet: user.address },
            include: { role: true }
          });

          if (!dbUser) {
                        const userRole = await prisma.role.findFirst({
              where: { name: "ADMIN" } 
            });
            
            if (!userRole) {
              throw new Error("Role ADMIN not exist");
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
          console.error("[NextAuth] Database error during signIn:", e);
          
          if (e instanceof Error && e.message.includes("Can't reach database server")) {
            console.warn("[NextAuth] Database server unreachable, allowing authentication without DB operations");
            return true; 
          }
          
          return false;
        }
      }
      return true;
    },
    async signOut({ token }: { token: Record<string, unknown> }) {
      try {
        let retries = 3;
        while (retries > 0) {
          try {
            await prisma.$connect();
            break;
          } catch (connectError) {
            retries--;
            if (retries === 0) {
              console.error("[NextAuth] Failed to connect to database during signOut after 3 retries:", connectError);
              return;
            }
            console.warn(`[NextAuth] Database connection failed during signOut, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
          }
        }
        
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
        
        if (error instanceof Error && error.message.includes("Can't reach database server")) {
          console.warn("[NextAuth] Database server unreachable during signOut, allowing signOut without DB operations");
        }
      }
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 