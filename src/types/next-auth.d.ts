declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      image?: string | null;
      address?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    image?: string | null;
    address?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    address?: string;
  }
} 
