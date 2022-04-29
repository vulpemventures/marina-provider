import {
  AddressInterface,
  Balance,
  DescriptorTemplate,
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
  // ask the extension for authorization (by hostname)
  enable(): Promise<void>;
  // disable access to the extension from the current hostname
  disable(): Promise<void>;
  // return true if the current hostname calling this method is authorized to access marina's provider instance
  isEnabled(): Promise<boolean>;
  // return true if the current marina extension is ready to use connected apps
  // i.e user done the onboarding process
  isReady(): Promise<boolean>;

  // set up a listener for an event type
  on(type: MarinaEventType, callback: (payload: any) => void): EventListenerID;
  // remove a listener for an event type
  off(listenerId: EventListenerID): void;

  // the current network the extension is connected to
  getNetwork(): Promise<NetworkString>;
  // return the assets accepted as network fees
  getFeeAssets(): Promise<string[]>;
  // which account is currently selected
  getSelectedAccount(): Promise<string>;

  createAccount(accountName: string): Promise<void>;

  // select an account
  // return true if the account is ready to be used,
  // false if u need to set up the script templates
  useAccount(account: string): Promise<boolean>;

  /** all the methods above apply to the selected account **/

  // set up descriptor templates for the current account
  // fails if the account has already a template
  // if not setup, changeTemplate = template
  importTemplate(
    template: DescriptorTemplate,
    changeTemplate?: DescriptorTemplate
  ): Promise<void>;

  getBalances(): Promise<Balance[]>;
  getCoins(): Promise<Utxo[]>;
  getTransactions(): Promise<Transaction[]>;

  getNextAddress(): Promise<AddressInterface>;
  getNextChangeAddress(): Promise<AddressInterface>;
  getAddresses(): Promise<AddressInterface[]>;

  sendTransaction(
    recipients: Recipient[],
    feeAsset?: string
  ): Promise<SentTransaction>;

  blindTransaction(pset: PsetBase64): Promise<PsetBase64>;
  // signs input(s) owned by the current account
  signTransaction(pset: PsetBase64): Promise<PsetBase64>;

  signMessage(message: string): Promise<SignedMessage>;

  // force marina to start an update for the current account
  reloadCoins(): Promise<void>;
}
