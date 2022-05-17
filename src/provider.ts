import {
  AccountID,
  AddressInterface,
  Balance,
  DescriptorTemplate,
  EventListenerID,
  MarinaEventType,
  NetworkString,
  PsetBase64,
  RawHex,
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
  getSelectedAccount(): Promise<AccountID>;
  // return the list of accounts
  getAccountsIDs(): Promise<AccountID[]>;

  // create a new account, accountID must be unique
  // ask the user to unlock the wallet and generate a new sub-privatekey depending on the accountID (SLIP13)
  // use importTemplate to set up the account's descriptor(s)
  createAccount(accountID: AccountID): Promise<void>;

  // getters with no param = get for all accounts
  getBalances(accountIDs?: AccountID[]): Promise<Balance[]>;
  getCoins(accountIDs?: AccountID[]): Promise<Utxo[]>;
  getTransactions(accountIDs?: AccountID): Promise<Transaction[]>;
  getAddresses(accountIDs?: AccountID): Promise<AddressInterface[]>;
  // reloadCoins can be used to launch an update task for a given account list
  reloadCoins(accountIDs?: AccountID[]): Promise<void>;

  // coinselect coins from the account's utxo list
  // try to blind and sign if necessary, then broadcast the transaction
  sendTransaction(
    recipients: Recipient[],
    feeAsset?: string
  ): Promise<SentTransaction>;
  // signs input(s) of the pset owned by any accounts
  signTransaction(pset: PsetBase64): Promise<PsetBase64>;
  // broadcast transaction sent by user
  // check inputs for used coins and lock them
  // check outputs for unconfirmed utxos and credit them
  broadcastTransaction(signedTxHex: RawHex): Promise<SentTransaction>;

  // TODO implement blindTransaction
  blindTransaction(pset: PsetBase64): Promise<PsetBase64>;

  // select an account
  // return true if the account is ready to be used,
  // false if u need to set up the script templates
  useAccount(accountID: AccountID): Promise<boolean>;
  /** all the methods above apply to the selected account **/

  // set up descriptor templates for the current account
  // fails if the account has already a template
  // if not setup, changeTemplate = template
  importTemplate(
    template: DescriptorTemplate,
    changeTemplate?: DescriptorTemplate
  ): Promise<void>;

  // get next (change) address for the current selected account
  getNextAddress(): Promise<AddressInterface>;
  getNextChangeAddress(): Promise<AddressInterface>;

  signMessage(message: string): Promise<SignedMessage>;
}
