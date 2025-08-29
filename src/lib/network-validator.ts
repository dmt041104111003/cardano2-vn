export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export class NetworkValidator {
  static validateMetaMaskNetwork(chainId: number | string): ValidationResult {
    let chainIdNum: number;
    if (typeof chainId === 'string') {
      if (chainId.startsWith('0x')) {
        chainIdNum = parseInt(chainId, 16);
      } else {
        chainIdNum = parseInt(chainId, 10);
      }
    } else {
      chainIdNum = chainId;
    }

    if (chainIdNum === 2001) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        error: `Only Milkomeda C1 Mainnet (Chain ID: 2001) is supported. Current network: ${chainIdNum}`
      };
    }
  }

  static validateCardanoNetwork(networkId: number | string, walletName: string): ValidationResult {
    let networkIdNum: number;
    if (typeof networkId === 'string') {
      networkIdNum = parseInt(networkId, 10);
    } else {
      networkIdNum = networkId;
    }

    if (networkIdNum === 1) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        error: `Only Cardano Mainnet (Network ID: 1) is supported. Current network: ${networkIdNum}`
      };
    }
  }
}
