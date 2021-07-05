export interface AddressInterface {
  confidentialAddress: string;
  blindingPrivateKey: string;
  derivationPath?: string;
}

export interface SignedMessage {
  signature: SignatureBase64;
  address: NativeSegwitAddress;
}

export enum TxStatusEnum {
  Confirmed = 1,
  Pending = 0,
}

export interface Transaction {
  txId: string;
  status: TxStatusEnum;
  fee: number;
  transfers: Array<{ asset: string; amount: number; }>;
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
  },
  amount: number;
}

export enum MarinaEventType {
  NEW_UTXO = 'NEW_UTXO',
  NEW_TX = 'NEW_TX',
  SPENT_UTXO = 'SPENT_UTXO',
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED',
}

export type Payload<T extends MarinaEventType> =
  T extends MarinaEventType.NEW_TX ? Transaction
  : T extends MarinaEventType.NEW_UTXO ? Utxo
  : T extends MarinaEventType.SPENT_UTXO ? { txid: string; vout: number; }
  : T extends MarinaEventType.ENABLED | MarinaEventType.DISABLED ? { network: string; hostname: string; }
  : any

export type TransactionHex = string;
export type PsetBase64 = string;
export type SignatureBase64 = string;
export type NativeSegwitAddress = string;

export interface MarinaProvider {
  enable(): Promise<void>;

  disable(): Promise<void>;

  isEnabled(): Promise<boolean>;

  setAccount(account: number): Promise<void>;

  getNetwork(): Promise<'liquid' | 'regtest'>;

  getAddresses(): Promise<AddressInterface[]>;

  getNextAddress(): Promise<AddressInterface>;

  getNextChangeAddress(): Promise<AddressInterface>;

  sendTransaction(
    recipientAddress: string,
    amountInSatoshis: number,
    assetHash: string
  ): Promise<TransactionHex>;

  blindTransaction(pset: PsetBase64): Promise<PsetBase64>;

  signTransaction(pset: PsetBase64): Promise<PsetBase64>;

  signMessage(message: string): Promise<SignedMessage>;

  getCoins(): Promise<Utxo[]>;

  getTransactions(): Promise<Transaction[]>;

  getBalances(): Promise<Balance[]>;

  on(type: MarinaEventType, callback: (payload: Payload<typeof type>) => void): void;
}