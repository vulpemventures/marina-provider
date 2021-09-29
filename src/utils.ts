import { MarinaProvider } from './provider';
import { DataRecipient, AddressRecipient, Recipient } from './types';

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

export function isDataRecipient(
  recipient: Recipient
): recipient is DataRecipient {
  const data = (recipient as DataRecipient).data;
  return data !== undefined && typeof data === 'string';
}

export function isAddressRecipient(
  recipient: Recipient
): recipient is AddressRecipient {
  const address = (recipient as AddressRecipient).address;
  return address !== undefined && typeof address === 'string';
}
