import { ethers } from 'ethers';

export interface MetaMaskUser {
  address: string;
  name?: string;
  image?: string;
  chainId?: number;
  network?: string;
}

export interface MetaMaskConfig {
  network: 'mainnet' | 'testnet';
  chainId: number;
  rpcUrl: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

export class MetaMaskProvider {
  private config: MetaMaskConfig;
  private provider: ethers.BrowserProvider | null = null;
  private user: MetaMaskUser | null = null;
  private signer: ethers.JsonRpcSigner | null = null;

  constructor(config: MetaMaskConfig) {
    this.config = config;
  }

  async connect(): Promise<MetaMaskUser> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask first.');
      }

      const eth: any = window.ethereum as any;
      const mmProvider: any = Array.isArray(eth?.providers)
        ? eth.providers.find((p: any) => p && p.isMetaMask)
        : (eth && eth.isMetaMask ? eth : null);

      if (!mmProvider) {
        throw new Error('MetaMask provider not found. Please ensure MetaMask is enabled.');
      }

      const accounts = await mmProvider.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect your MetaMask wallet.');
      }

      const address = accounts[0];
      this.provider = new ethers.BrowserProvider(mmProvider);
      this.signer = await this.provider.getSigner();
      const network = await this.provider.getNetwork();
      const chainId = Number(network.chainId);
      if (chainId !== this.config.chainId) {
        await mmProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${this.config.chainId.toString(16)}` }],
        }).catch(async (switchError: any) => {
          if (switchError?.code === 4902) {
            await mmProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${this.config.chainId.toString(16)}`,
                  chainName: this.config.chainName,
                  nativeCurrency: this.config.nativeCurrency,
                  rpcUrls: [this.config.rpcUrl],
                  blockExplorerUrls: this.config.blockExplorerUrls,
                },
              ],
            });
          } else {
            throw switchError;
          }
        });
      }

      this.user = {
        address,
        name: 'MetaMask User',
        image: undefined,
        chainId,
        network: this.config.chainName
      };

      return this.user;
    } catch (error) {
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.provider = null;
    this.signer = null;
    this.user = null;
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer || !this.user) {
      throw new Error('MetaMask not connected');
    }

    try {
      const signature = await this.signer.signMessage(message);
      return signature;
    } catch (error) {
      throw error;
    }
  }

  async switchNetwork(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${this.config.chainId.toString(16)}` }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await this.addNetwork();
      } else {
        throw switchError;
      }
    }
  }

  async addNetwork(): Promise<void> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${this.config.chainId.toString(16)}`,
            chainName: this.config.chainName,
            nativeCurrency: this.config.nativeCurrency,
            rpcUrls: [this.config.rpcUrl],
            blockExplorerUrls: this.config.blockExplorerUrls,
          },
        ],
      });
    } catch (error) {
      throw error;
    }
  }



  getCurrentUser(): MetaMaskUser | null {
    return this.user;
  }

  getConnectionStatus(): boolean {
    return this.provider !== null && this.signer !== null;
  }

  getProvider(): ethers.BrowserProvider | null {
    return this.provider;
  }

  getSigner(): ethers.JsonRpcSigner | null {
    return this.signer;
  }

  getConfig(): MetaMaskConfig {
    return this.config;
  }

  updateConfig(newConfig: MetaMaskConfig): void {
    this.config = newConfig;
  }
}

export const MILKOMEDA_C1_MAINNET: MetaMaskConfig = {
  network: 'mainnet',
  chainId: 2001,
  rpcUrl: 'https://rpc-mainnet-cardano-evm.c1.milkomeda.com',
  chainName: 'Milkomeda C1 Mainnet',
  nativeCurrency: {
    name: 'mADA',
    symbol: 'mADA',
    decimals: 18,
  },
  blockExplorerUrls: ['https://explorer-mainnet-cardano-evm.c1.milkomeda.com'],
};



export const metaMaskProvider = new MetaMaskProvider(MILKOMEDA_C1_MAINNET);
declare global {
  interface Window {
    ethereum?: any;
  }
}
