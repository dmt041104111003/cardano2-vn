import makeBlockie from 'ethereum-blockies-base64';

export function generateWalletAvatar(address: string): string {
  return makeBlockie(address.toLowerCase());
}
