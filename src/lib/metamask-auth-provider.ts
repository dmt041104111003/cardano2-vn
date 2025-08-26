import CredentialsProvider from "next-auth/providers/credentials";

export function MetaMaskAuthProvider() {
  return CredentialsProvider({
    id: "metamask-wallet",
    name: "MetaMask Wallet",
    credentials: {
      address: { label: "Wallet Address", type: "text" },
      signature: { label: "Signature", type: "text" },
      message: { label: "Message", type: "text" },
      chainId: { label: "Chain ID", type: "text" },
      network: { label: "Network", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.address || !credentials?.signature || !credentials?.message) {
        return null;
      }

      try {
        const user = {
          id: credentials.address,
          address: credentials.address,
          name: `MetaMask User (${credentials.network || 'Milkomeda C1'})`,
          image: null,
          chainId: credentials.chainId,
          network: credentials.network,
        };

        return user;
      } catch (error) {
        return null;
      }
    },
  });
}
