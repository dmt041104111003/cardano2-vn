import { BrowserWallet } from '@meshsdk/core';
import { CardanoWalletUser, CardanoWalletConfig } from '~/constants/wallet';

export class CardanoWalletProvider {
  private config: CardanoWalletConfig;
  private wallet: BrowserWallet | null = null;
  private user: CardanoWalletUser | null = null;
  private currentWalletName: string = '';

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
      this.currentWalletName = walletName;
      
      const addresses = await this.wallet.getUnusedAddresses();
      const address = addresses[0];
      
      this.user = {
        address,
        name: walletInfo.name,
        image: walletInfo.icon
      };

      return this.user;
    } catch (error) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.wallet = null;
    this.user = null;
    this.currentWalletName = '';
  }

  async signMessage(message: string): Promise<string> {
    if (!this.wallet || !this.user) {
      throw new Error('Wallet not connected');
    }

    try {
      const signature = await this.wallet.signData(message);
      return signature.signature;
    } catch (error) {
      throw error;
    }
  }



  async getAvailableWallets(): Promise<Array<{ name: string; icon: string; version: string }>> {
    try {
      return await BrowserWallet.getAvailableWallets();
    } catch (error) {
      return [];
    }
  }

  async isWalletInstalled(walletName?: string): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    if (walletName) {
      return this.checkWalletAvailability(walletName);
    }
    
    return true;
  }

  private async checkWalletAvailability(walletName: string): Promise<boolean> {
    const walletMap: { [key: string]: string } = {
      'eternal': 'eternl',
      'lace': 'lace'
    };

    const actualWalletName = walletMap[walletName] || walletName;
    
    try {
      const availableWallets = await BrowserWallet.getAvailableWallets();
      
      const isAvailable = availableWallets.some(wallet => wallet.name === actualWalletName);
      return isAvailable;
    } catch (error) {
      return false;
    }
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

  getCurrentWalletName(): string {
    return this.currentWalletName;
  }

  getConfig(): CardanoWalletConfig {
    return this.config;
  }
}

export const WALLET_NAMES = {
  eternal: 'eternl',
  lace: 'lace'
};

export const cardanoWallet = new CardanoWalletProvider({
  network: 'mainnet'
}); 