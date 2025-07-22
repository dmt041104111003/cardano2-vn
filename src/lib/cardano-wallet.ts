import { BrowserWallet } from '@meshsdk/core';

export interface CardanoWalletUser {
  address: string;
  name?: string;
  image?: string;
  balance?: string;
}

export interface CardanoWalletConfig {
  network: 'mainnet';
}

export class CardanoWalletProvider {
  private config: CardanoWalletConfig;
  private wallet: BrowserWallet | null = null;
  private user: CardanoWalletUser | null = null;

  constructor(config: CardanoWalletConfig) {
    this.config = config;
  }

  async connect(walletName: string = 'eternl'): Promise<CardanoWalletUser> {
    try {
      const availableWallets = await BrowserWallet.getAvailableWallets();
      const walletInfo = availableWallets.find(w => w.name === walletName);
      
      if (!walletInfo) {
        throw new Error(`Wallet ${walletName} is not installed. Please install it first.`);
      }

      this.wallet = await BrowserWallet.enable(walletName);
      
      const addresses = await this.wallet.getUnusedAddresses();
      const address = addresses[0];
      
      const balance = await this.wallet.getLovelace();
      
      this.user = {
        address,
        name: walletInfo.name,
        image: walletInfo.icon,
        balance: balance.toString()
      };

      return this.user;
    } catch (error) {
      console.error('Error connecting to Cardano wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.wallet = null;
    this.user = null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.wallet || !this.user) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.wallet.signData(message);
      return signature.signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }

  async getBalance(): Promise<string> {
    if (!this.wallet) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await this.wallet.getLovelace();
      return balance.toString();
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getAvailableWallets(): Promise<Array<{ name: string; icon: string; version: string }>> {
    try {
      return await BrowserWallet.getAvailableWallets();
    } catch (error) {
      console.error('Error getting available wallets:', error);
      return [];
    }
  }

  isWalletInstalled(): boolean {
    return typeof window !== 'undefined';
  }

  getCurrentUser(): CardanoWalletUser | null {
    return this.user;
  }

  getConnectionStatus(): boolean {
    return this.wallet !== null;
  }

  getWallet(): BrowserWallet | null {
    return this.wallet;
  }
}

export const cardanoWallet = new CardanoWalletProvider({
  network: 'mainnet'
}); 