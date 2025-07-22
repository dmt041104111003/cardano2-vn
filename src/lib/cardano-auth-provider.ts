import CredentialsProvider from "next-auth/providers/credentials";

export function CardanoWalletProvider() {
  return CredentialsProvider({
    id: "cardano-wallet",
    name: "Cardano Wallet",
    credentials: {
      address: { label: "Wallet Address", type: "text" },
      signature: { label: "Signature", type: "text" },
      message: { label: "Message", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.address || !credentials?.signature || !credentials?.message) {
        return null;
      }

      try {
        const user = {
          id: credentials.address,
          address: credentials.address,
          name: `Cardano Wallet User`,
          image: null,
        };

        return user;
      } catch (error) {
        console.error("Error in Cardano wallet authorization:", error);
        return null;
      }
    },
  });
} 