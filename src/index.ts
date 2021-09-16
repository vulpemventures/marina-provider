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

export interface Recipient {
  address: string; // the recipient address
  value: number; // the amount of sats to send
  asset: string; // the asset to send
}

export type MarinaEventType =
  | 'NEW_UTXO'
  | 'NEW_TX'
  | 'SPENT_UTXO'
  | 'ENABLED'
  | 'DISABLED'
  | 'NETWORK';

export type TransactionHex = string;
export type PsetBase64 = string;
export type SignatureBase64 = string;
export type NativeSegwitAddress = string;
export type EventListenerID = string;

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
    recipients: Recipient[],
    feeAsset?: string
  ): Promise<TransactionHex>;

  blindTransaction(pset: PsetBase64): Promise<PsetBase64>;

  signTransaction(pset: PsetBase64): Promise<PsetBase64>;

  signMessage(message: string): Promise<SignedMessage>;

  getCoins(): Promise<Utxo[]>;

  getTransactions(): Promise<Transaction[]>;

  getBalances(): Promise<Balance[]>;

  on(type: MarinaEventType, callback: (payload: any) => void): EventListenerID;

  off(listenerId: EventListenerID): void;

  getFeeAssets(): Promise<string[]>;
}

/**
 * listen with timeout the `providerName#initialized` event
 * @param provider the name of the provider to detect "marina" for window.marina
 * @param timeout configurable timeout, default is 3000 (expressed in milliseconds)
 */
export async function detectProvider<T = MarinaProvider>(
  provider: string = 'marina',
  timeout: number = 3000
): Promise<T> {
  let handled = false;
  let windowObject = window as any;

  return new Promise<T>((resolve, reject) => {
    if (windowObject[provider]) {
      handleProvider();
    } else {
      window.addEventListener(`${provider}#initialized`, handleProvider, {
        once: true,
      });

      setTimeout(() => {
        handleProvider();
      }, timeout);
    }

    function handleProvider() {
      if (handled) return;
      handled = true;

      window.removeEventListener(`${provider}#initialized`, handleProvider);
      if (typeof windowObject[provider] !== 'undefined') {
        resolve(windowObject[provider]);
        return;
      }

      reject(new DetectProviderTimeoutError(provider, timeout));
    }
  });
}

export class DetectProviderTimeoutError extends Error {
  provider: string;
  timeout: number;

  constructor(provider: string, timeout: number) {
    super(
      `detectProviderTimeout: detection of ${provider} timeout (${timeout} ms)`
    );
    this.provider = provider;
    this.timeout = timeout;
  }
}
