export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class NetworkValidator {
  static validateMetaMaskNetwork(chainId: number): ValidationResult {
    if (chainId === 2001) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        error: `Only Milkomeda C1 Mainnet (Chain ID: 2001) is supported. Current network: ${chainId}`
      };
    }
  }

  static validateCardanoNetwork(networkId: number, walletName: string): ValidationResult {
    if (networkId === 1) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        error: `Only Cardano Mainnet (Network ID: 1) is supported. Current network: ${networkId}`
      };
    }
  }
}
