import {
  AddressInterface,
  Balance,
  EventListenerID,
  MarinaEventType,
  NetworkString,
  PsetBase64,
  Recipient,
  SentTransaction,
  SignedMessage,
  Transaction,
  Utxo,
} from './types';

/**
 * Define the Marina provider methods.
 * Provided by marina extension at window.marina
 */
export interface MarinaProvider {
  enable(): Promise<void>;

  disable(): Promise<void>;

  isEnabled(): Promise<boolean>;

  setAccount(account: number): Promise<void>;

  getNetwork(): Promise<NetworkString>;

  getAddresses(): Promise<AddressInterface[]>;

  getNextAddress(): Promise<AddressInterface>;

  getNextChangeAddress(): Promise<AddressInterface>;

  sendTransaction(
    recipients: Recipient[],
    feeAsset?: string
  ): Promise<SentTransaction>;

  blindTransaction(pset: PsetBase64): Promise<PsetBase64>;

  signTransaction(pset: PsetBase64): Promise<PsetBase64>;

  signMessage(message: string): Promise<SignedMessage>;

  getCoins(): Promise<Utxo[]>;

  getTransactions(): Promise<Transaction[]>;

  getBalances(): Promise<Balance[]>;

  on(type: MarinaEventType, callback: (payload: any) => void): EventListenerID;

  off(listenerId: EventListenerID): void;

  getFeeAssets(): Promise<string[]>;

  reloadCoins(): Promise<void>;
}
