// Cardano Wallet Components Interfaces
export interface CardanoWalletUser {
  address: string;
  name?: string;
  image?: string;
  balance?: string;
}

export interface CardanoWalletConfig {
  network: 'mainnet';
} 