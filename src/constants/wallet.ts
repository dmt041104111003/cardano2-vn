// Cardano Wallet Components Interfaces
export interface CardanoWalletUser {
  address: string;
  name?: string;
  image?: string;
}

export interface CardanoWalletConfig {
  network: 'mainnet';
} 