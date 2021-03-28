export interface AddressInterface {
    confidentialAddress: string;
    blindingPrivateKey: string;
    derivationPath?: string;
}
export interface MarinaProvider {
    enable(): Promise<void>;
    disable(): Promise<void>;
    isEnabled(): Promise<boolean>;
    setAccount(account: number): Promise<void>;
    getNetwork(): Promise<'liquid' | 'regtest'>;
    getAddresses(): Promise<AddressInterface[]>;
    getNextAddress(): Promise<AddressInterface>;
    getNextChangeAddress(): Promise<AddressInterface>;
    sendTransaction(recipientAddress: string, amountInSatoshis: number, assetHash: string): Promise<string>;
    blindTransaction(psetBase64: string): Promise<string>;
    signTransaction(psetBase64: string): Promise<string>;
}
