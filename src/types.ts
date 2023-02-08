
import type { Argument, Artifact, Contract } from "@ionio-lang/ionio";
import type { TxOutput } from "liquidjs-lib";

export type TransactionID = string;
export type PsetBase64 = string;
export type SignatureBase64 = string;
export type NativeSegwitAddress = string;
export type ECPublicKey = string;
export type EventListenerID = string;
export type RawHex = string;
export type AccountID = string;
export type NetworkString = 'liquid' | 'testnet' | 'regtest';

export interface SignedMessage {
  signature: SignatureBase64;
  address: NativeSegwitAddress;
  publicKey: ECPublicKey;
}

export interface Transaction {
  txId: string;
  hex?: string;
  height: number; // 0 means unconfirmed
  explorerURL: string;
}

export interface ScriptDetails {
  network: NetworkString;
  accountName: string;
  derivationPath?: string;
  blindingPrivateKey?: string;
}

// data structure sent to getNextAddress in order to compute a Ionio account address
export type ArtifactWithConstructorArgs = {
  artifact: Artifact;
  args: { [name: string]: Argument };
};

export type IonioScriptDetails = ScriptDetails & { artifact: Artifact; params: Argument[]; };

export function isIonioScriptDetails(script: ScriptDetails): script is IonioScriptDetails {
  return (script as IonioScriptDetails).artifact !== undefined;
}

export type Address = {
  confidentialAddress: string;
  contract?: Contract;
} & ScriptDetails;

export interface UnblindingData {
  value: number;
  asset: string;
  assetBlindingFactor: string;
  valueBlindingFactor: string;
};

export interface UnblindedOutput {
  txid: string;
  vout: number;
  blindingData?: UnblindingData; // optional, if not present it means marina can't unblind the output
}

export type Utxo = UnblindedOutput & { witnessUtxo?: TxOutput, scriptDetails?: ScriptDetails };

// add an OP_RETURN output
export type DataRecipient = {
  data: string;
} & AssetValue;

export type AddressRecipient = {
  address: string; // the recipient address
} & AssetValue;

export type Recipient = AddressRecipient | DataRecipient;

interface AssetValue {
  value: number; // the amount of sats to send
  asset: string; // the asset to send
}

export interface Asset {
  assetHash: string;
  name: string;
  precision: number;
  ticker: string;
};

export interface Balance {
  asset: Asset;
  amount: number;
}

export type MarinaEventType =
  | 'NEW_UTXO'
  | 'NEW_TX'
  | 'SPENT_UTXO'
  | 'ENABLED'
  | 'DISABLED'
  | 'NETWORK';


// return object from sendTransaction
export interface SentTransaction {
  txid: TransactionID;
  hex: RawHex;
}

export enum AccountType {
  P2WPKH = 'p2wpkh',
  Ionio = 'ionio',
}

export interface AccountInfo {
  accountID: AccountID;
  type: AccountType;
  masterXPub: string;
  baseDerivationPath: string;
  accountNetworks: NetworkString[];
}
