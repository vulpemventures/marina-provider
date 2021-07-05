export interface AddressInterface {
    confidentialAddress: string;
    blindingPrivateKey: string;
    derivationPath?: string;
}
export interface SignedMessage {
    signature: SignatureBase64;
    address: NativeSegwitAddress;
}
export declare enum TxStatusEnum {
    Confirmed = 1,
    Pending = 0
}
export interface Transaction {
    txId: string;
    status: TxStatusEnum;
    fee: number;
    transfers: Array<{
        asset: string;
        amount: number;
    }>;
    explorerURL: string;
    blocktimeMs: number;
}
export interface Utxo {
    txid: string;
    vout: number;
    asset?: string;
    value?: number;
}
export interface Balance {
    asset: {
        assetHash: string;
        ticker?: string;
        name?: string;
        precision: number;
    };
    amount: number;
}
export declare type MarinaEventType = 'new_utxo' | 'new_tx' | 'spent_utxo';
export declare type TransactionHex = string;
export declare type PsetBase64 = string;
export declare type SignatureBase64 = string;
export declare type NativeSegwitAddress = string;
export interface MarinaProvider {
    enable(): Promise<void>;
    disable(): Promise<void>;
    isEnabled(): Promise<boolean>;
    setAccount(account: number): Promise<void>;
    getNetwork(): Promise<'liquid' | 'regtest'>;
    getAddresses(): Promise<AddressInterface[]>;
    getNextAddress(): Promise<AddressInterface>;
    getNextChangeAddress(): Promise<AddressInterface>;
    sendTransaction(recipientAddress: string, amountInSatoshis: number, assetHash: string): Promise<TransactionHex>;
    blindTransaction(pset: PsetBase64): Promise<PsetBase64>;
    signTransaction(pset: PsetBase64): Promise<PsetBase64>;
    signMessage(message: string): Promise<SignedMessage>;
    getCoins(): Promise<Utxo[]>;
    getTransactions(): Promise<Transaction[]>;
    getBalances(): Promise<Balance[]>;
    on(type: MarinaEventType, callback: (payload: any) => void): void;
}
