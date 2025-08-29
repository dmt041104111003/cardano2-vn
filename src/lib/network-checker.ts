export interface NetworkCheckResult {
  walletType: 'metamask' | 'cardano' | 'none';
  isMainnet: boolean;
  networkName: string;
  chainId?: string;
  networkId?: number;
  error?: string;
}

export interface WalletNetworkInfo {
  walletType: 'metamask' | 'cardano';
  isConnected: boolean;
  isMainnet: boolean;
  networkName: string;
  chainId?: string;
  networkId?: number;
}

export class NetworkChecker {
  static async checkMetaMaskNetwork(): Promise<NetworkCheckResult> {
    try {
      if (typeof window.ethereum === "undefined") {
        return {
          walletType: 'none',
          isMainnet: false,
          networkName: 'MetaMask not installed',
          error: 'MetaMask is not installed'
        };
      }

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        return {
          walletType: 'metamask',
          isMainnet: false,
          networkName: 'MetaMask not connected',
          error: 'Please connect your MetaMask wallet'
        };
      }

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      if (chainId === "0x7d1") {
        return {
          walletType: 'metamask',
          isMainnet: true,
          networkName: 'Milkomeda C1 Mainnet',
          chainId: chainId
        };
      } else {
        return {
          walletType: 'metamask',
          isMainnet: false,
          networkName: `Chain ID: ${chainId}`,
          chainId: chainId,
          error: `Only Milkomeda C1 Mainnet (Chain ID: 0x7d1) is supported. Current network: ${chainId}`
        };
      }
    } catch (error) {
      return {
        walletType: 'metamask',
        isMainnet: false,
        networkName: 'Error checking MetaMask',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  static async checkCardanoNetwork(): Promise<NetworkCheckResult> {
    try {
      const availableWallets = await this.getAvailableCardanoWallets();
      
      if (availableWallets.length === 0) {
        return {
          walletType: 'none',
          isMainnet: false,
          networkName: 'No Cardano wallet found',
          error: 'No Cardano wallet is installed'
        };
      }

      for (const walletName of availableWallets) {
        try {
          const wallet = await this.connectToCardanoWallet(walletName);
          if (wallet) {
            const networkId = await wallet.getNetworkId();
            
            if (networkId === 1) {
              return {
                walletType: 'cardano',
                isMainnet: true,
                networkName: 'Cardano Mainnet',
                networkId: networkId
              };
            } else {
              return {
                walletType: 'cardano',
                isMainnet: false,
                networkName: `Network ID: ${networkId}`,
                networkId: networkId,
                error: `Only Cardano Mainnet (Network ID: 1) is supported. Current network: ${networkId}`
              };
            }
          }
        } catch (error) {
          console.warn(`Failed to connect to ${walletName}:`, error);
          continue;
        }
      }

      return {
        walletType: 'cardano',
        isMainnet: false,
        networkName: 'No Cardano wallet connected',
        error: 'Please connect your Cardano wallet'
      };
    } catch (error) {
      return {
        walletType: 'cardano',
        isMainnet: false,
        networkName: 'Error checking Cardano wallet',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private static async getAvailableCardanoWallets(): Promise<string[]> {
    const wallets = [];
    
    const walletChecks = [
      { name: 'nami', check: () => window.cardano?.nami },
      { name: 'eternl', check: () => window.cardano?.eternl },
      { name: 'lace', check: () => window.cardano?.lace },
      { name: 'yoroi', check: () => window.cardano?.yoroi },
      { name: 'flint', check: () => window.cardano?.flint },
      { name: 'typhon', check: () => window.cardano?.typhon },
      { name: 'gero', check: () => window.cardano?.gero },
      { name: 'nufi', check: () => window.cardano?.nufi }
    ];

    for (const wallet of walletChecks) {
      if (wallet.check()) {
        wallets.push(wallet.name);
      }
    }

    return wallets;
  }

  private static async connectToCardanoWallet(walletName: string): Promise<any> {
    try {
      const wallet = window.cardano?.[walletName];
      if (wallet) {
        return await wallet.enable();
      }
    } catch (error) {
      console.warn(`Failed to enable ${walletName}:`, error);
    }
    return null;
  }

  static async checkAllNetworks(): Promise<NetworkCheckResult[]> {
    const results = [];
    
    const metamaskResult = await this.checkMetaMaskNetwork();
    results.push(metamaskResult);
    
    const cardanoResult = await this.checkCardanoNetwork();
    results.push(cardanoResult);
    
    return results;
  }

  static async validateMainnetOnly(): Promise<{ isValid: boolean; errors: string[] }> {
    const results = await this.checkAllNetworks();
    const errors: string[] = [];
    
    for (const result of results) {
      if (result.walletType !== 'none' && !result.isMainnet) {
        errors.push(result.error || `Invalid network: ${result.networkName}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static setupNetworkChangeListeners(): () => void {
    const cleanupFunctions: (() => void)[] = [];

    if (typeof window.ethereum !== "undefined") {
      const handleChainChanged = (chainId: string) => {
        window.location.reload();
      };

      window.ethereum.on('chainChanged', handleChainChanged);
      cleanupFunctions.push(() => {
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      });
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
