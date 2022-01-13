export interface AddressInterface {
  confidentialAddress: string;
  blindingPrivateKey: string;
  derivationPath?: string;
}

export interface SignedMessage {
  signature: SignatureBase64;
  address: NativeSegwitAddress;
  publicKey: ECPublicKey;
}

export enum TxStatusEnum {
  Confirmed = 1,
  Pending = 0,
}

export interface Transaction {
  txId: string;
  status: TxStatusEnum;
  fee: number;
  transfers: Array<{ asset: string; amount: number }>;
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

// add an OP_RETURN output
export type DataRecipient = {
  data: string;
} & AssetValue;

export type AddressRecipient = {
  address: string; // the recipient address
} & AssetValue;

interface AssetValue {
  value: number; // the amount of sats to send
  asset: string; // the asset to send
}

export type Recipient = AddressRecipient | DataRecipient;

export type MarinaEventType =
  | 'NEW_UTXO'
  | 'NEW_TX'
  | 'SPENT_UTXO'
  | 'ENABLED'
  | 'DISABLED'
  | 'NETWORK';

export type TransactionID = string;
export type PsetBase64 = string;
export type SignatureBase64 = string;
export type NativeSegwitAddress = string;
export type ECPublicKey = string;
export type EventListenerID = string;

export type NetworkString = 'liquid' | 'testnet' | 'regtest';
