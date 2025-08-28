import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "~/lib/prisma"
import { CardanoWalletProvider } from "~/lib/cardano-auth-provider"
import { MetaMaskAuthProvider } from "~/lib/metamask-auth-provider"
import { generateWalletAvatar } from '~/lib/wallet-avatar';
import cloudinary from '~/lib/cloudinary';

const roleCache = new Map<string, any>();

interface TokenWithAddress extends Record<string, unknown> {
  address?: string;
}

export const runtime = 'nodejs';

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
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    CardanoWalletProvider(),
    MetaMaskAuthProvider(),
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
      if (user && account?.provider === "metamask-wallet") {
        (token as TokenWithAddress).address = user.address;
      }
      if (user && account?.provider === "google") {
        token.email = user.email;
        token.provider = "google";
        token.image = user.image;
        token.name = user.name;
      }
      if (user && account?.provider === "github") {
        token.email = user.email;
        token.provider = "github";
        token.image = user.image;
        token.name = user.name;
      }
      return token;
    },
    async session(params: unknown) {
      const { session, token } = params as { session: import("next-auth").Session & { expires?: string }; token: Record<string, unknown> };
      if (typeof session.user === 'object' && session.user) {
        (session.user as Record<string, unknown> & { address?: string }).address = (token as TokenWithAddress).address;
        if (token.provider === "google" || token.provider === "github") {
          (session.user as Record<string, unknown> & { email?: string }).email = token.email as string;

          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: token.email as string },
              select: { image: true, name: true }
            });
            
            if (dbUser && dbUser.image) {
              session.user.image = dbUser.image;
            } else {
              session.user.image = token.image as string;
            }
            
            session.user.name = dbUser?.name || token.name as string;
          } catch (error) {
            session.user.image = token.image as string;
            session.user.name = token.name as string;
          }
        }
      }
      if (!session.expires) {
        session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(); // 30 ngày
      }
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
                return true;
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, name: true, image: true, roleId: true, email: true }
          });

          if (!dbUser) {
		let userRole = roleCache.get("USER");
		if (!userRole) {
		  userRole = await prisma.role.findFirst({
		    where: { name: "USER" },
		    select: { id: true }
		  });
		  if (userRole) {
 		   roleCache.set("USER", userRole);
 		 }
		}

		if (!userRole) {
 		 throw new Error("Role USER not exist");
		}


            let avatar: string | null = user.image || null;
            if (avatar && avatar.startsWith('https://lh3.googleusercontent.com')) {
              try {
                const uploadRes = await cloudinary.uploader.upload(avatar, { 
                  resource_type: 'image',
                  folder: 'google-avatars'
                });
                avatar = uploadRes.url;
              } catch (uploadError) {
                avatar = user.image || null;
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
              select: { id: true, name: true, image: true, roleId: true, email: true }
            });
            
          } else {
            
            if (dbUser.image !== user.image || (dbUser.name !== user.name && !dbUser.name)) {
              let avatar: string | null = user.image || dbUser.image;
              if (user.image && user.image.startsWith('https://lh3.googleusercontent.com') && user.image !== dbUser.image) {
                try {
                  const uploadRes = await cloudinary.uploader.upload(user.image, { 
                    resource_type: 'image',
                    folder: 'google-avatars'
                  });
                  avatar = uploadRes.url;
                } catch (uploadError) {
                  avatar = user.image;
                }
              }
              
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  name: dbUser.name || user.name, 
                  image: avatar,
                }
              });
            }
          }
          
          return true;
        } catch (e) {
          
          if (e instanceof Error && e.message.includes("Can't reach database server")) {
            return true;
          }
          
          return false;
        }
      }
      
      if (account?.provider === "github") {
        try {
          let retries = 3;
          while (retries > 0) {
            try {
              await prisma.$connect();
              break;
            } catch (connectError) {
              retries--;
              if (retries === 0) {
                return true;
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          let dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, name: true, image: true, roleId: true, email: true }
          });

          if (!dbUser) {
		let userRole = roleCache.get("USER");
		if (!userRole) {
		  userRole = await prisma.role.findFirst({
		    where: { name: "USER" },
		    select: { id: true }
		  });
		  if (userRole) {
 		   roleCache.set("USER", userRole);
 		 }
		}

		if (!userRole) {
		  throw new Error("Role USER not exist");
		}


            let avatar: string | null = user.image || null;
            if (avatar && avatar.startsWith('https://avatars.githubusercontent.com')) {
              try {
                const uploadRes = await cloudinary.uploader.upload(avatar, {
                  resource_type: 'image',
                  folder: 'github-avatars'
                });
                avatar = uploadRes.url;
              } catch (uploadError) {
                avatar = user.image || null;
              }
            }

            dbUser = await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || null,
                image: avatar,
                provider: "github",
                roleId: userRole.id,
              },
              select: { id: true, name: true, image: true, roleId: true, email: true }
            });
          } else {
            if (dbUser.image !== user.image || (dbUser.name !== user.name && !dbUser.name)) {
              let avatar: string | null = user.image || dbUser.image;
              if (user.image && user.image.startsWith('https://avatars.githubusercontent.com') && user.image !== dbUser.image) {
                try {
                  const uploadRes = await cloudinary.uploader.upload(user.image, {
                    resource_type: 'image',
                    folder: 'github-avatars'
                  });
                  avatar = uploadRes.url;
                } catch (uploadError) {
                  avatar = user.image;
                }
              }
              
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  name: dbUser.name || user.name, // Ưu tiên name từ database, nếu không có thì lấy từ GitHub
                  image: avatar,
                }
              });
            }
          }
          
          return true;
        } catch (e) {
          
          if (e instanceof Error && e.message.includes("Can't reach database server")) {
            return true;
          }
          
          return false;
        }
      }
      
      if (account?.provider === "metamask-wallet") {
        try {
          let retries = 3;
          while (retries > 0) {
            try {
              await prisma.$connect();
              break;
            } catch (connectError) {
              retries--;
              if (retries === 0) {
                return true;
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          let dbUser = await prisma.user.findUnique({
            where: { wallet: user.address },
            select: { id: true, name: true, image: true, roleId: true, wallet: true }
          });

          if (!dbUser) {
            let userRole = roleCache.get("USER");
            if (!userRole) {
              userRole = await prisma.role.findFirst({
                where: { name: "USER" },
                select: { id: true }
              });
              if (userRole) {
                roleCache.set("USER", userRole);
              }
            }

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
              select: { id: true, name: true, image: true, roleId: true, wallet: true }
            });
            
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
          }
          
          return true;
        } catch (e) {
          if (e instanceof Error && e.message.includes("Can't reach database server")) {
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
                return true;
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          let dbUser = await prisma.user.findUnique({
            where: { wallet: user.address },
            select: { id: true, name: true, image: true, roleId: true, wallet: true }
          });

          if (!dbUser) {
		let userRole = roleCache.get("USER");
		if (!userRole) {
		  userRole = await prisma.role.findFirst({
		    where: { name: "USER" },
		    select: { id: true }
		  });
 		 if (userRole) {
		    roleCache.set("USER", userRole);
		  }
		}

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
              select: { id: true, name: true, image: true, roleId: true, wallet: true }
            });
            
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
          }
          
          return true;
        } catch (e) {
          
          if (e instanceof Error && e.message.includes("Can't reach database server")) {
            return true; 
          }
          
          return false;
        }
      }
      return true;
    },
    async signOut() {
      return true;
    },
  },
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };