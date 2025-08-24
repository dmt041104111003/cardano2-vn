import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { prisma } from "~/lib/prisma";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string | null;
  wallet: string | null;
  image: string | null;
  role: {
    name: string;
  };
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) return null;

    const sessionUser = session.user as { address?: string; email?: string };
    
    let user = null;
    if (sessionUser.address) {
      user = await prisma.user.findUnique({
        where: { wallet: sessionUser.address },
        include: { role: true }
      });
    } else if (sessionUser.email) {
      user = await prisma.user.findUnique({
        where: { email: sessionUser.email },
        include: { role: true }
      });
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await requireAuth();
  if (user.role.name !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role.name === "ADMIN";
}
