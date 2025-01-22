import { setupModal, setupWalletSelector } from "@keypom/fastauth";
import "@keypom/fastauth/lib/styles.css";
import { setupBitteWallet } from "@near-wallet-selector/bitte-wallet";
import { NetworkId, WalletSelector } from "@near-wallet-selector/core";
import { setupHereWallet } from "@near-wallet-selector/here-wallet";
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet";
import "@near-wallet-selector/modal-ui/styles.css";
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet";
import { providers } from "near-api-js";
import { distinctUntilChanged, map } from "rxjs";

const THIRTY_TGAS = "30000000000000";
const NO_DEPOSIT = "0";
const IS_LOCAL_TESTING = false;

interface WalletOptions {
  networkId?: string;
  createAccessKeyFor?: string;
}

interface ViewMethodOptions {
  contractId: string;
  method: string;
  args?: Record<string, unknown>;
}

interface CallMethodOptions extends ViewMethodOptions {
  gas?: string;
  deposit?: string;
}

export class Wallet {
  private createAccessKeyFor: string | undefined;
  private networkId: string;
  private selector!: Promise<WalletSelector>;

  /**
   * @constructor
   * @param {Object} options - the options for the wallet
   * @param {string} options.networkId - the network id to connect to
   * @param {string} options.createAccessKeyFor - the contract to create an access key for
   * @example
   * const wallet = new Wallet({ networkId: 'testnet', createAccessKeyFor: 'contractId' });
   * wallet.startUp((signedAccountId) => console.log(signedAccountId));
   */
  constructor({ networkId = "testnet", createAccessKeyFor = undefined }: WalletOptions) {
    this.createAccessKeyFor = createAccessKeyFor;
    this.networkId = networkId;
  }

  /**
  * To be called when the website loads
  * @param {Function} accountChangeHook - a function that is called when the user signs in or out#
  * @returns {Promise<string>} - the accountId of the signed-in user
  */
  startUp = async (accountChangeHook: (accountId: string | undefined) => void): Promise<string> => {
    this.selector = setupWalletSelector({
      network: this.networkId as NetworkId,
      localTesting: IS_LOCAL_TESTING,
      modules: [
        setupMyNearWallet(),
        setupHereWallet(),
        setupBitteWallet(),
        setupMeteorWallet(),
      ],
    });

    const walletSelector = await this.selector;
    const isSignedIn = walletSelector.isSignedIn();
    const accountId = isSignedIn
      ? walletSelector.store.getState().accounts[0].accountId
      : "";

    walletSelector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged(),
      )
      .subscribe((accounts) => {
        const signedAccount = accounts.find(
          (account) => account.active,
        )?.accountId;
        accountChangeHook(signedAccount);
      });

    return accountId;
  };

  /**
  * Displays a modal to login the user
  */
  signIn = async (): Promise<void> => {
    if (!this.selector) throw new Error("Wallet not initialized");
    const modal = setupModal(await this.selector, {
      contractId: this.createAccessKeyFor || "",
      localTesting: IS_LOCAL_TESTING,
    });
    modal.show();
  };

  /**
 * Logout the user
 */
  signOut = async (): Promise<void> => {
    if (!this.selector) throw new Error("Wallet not initialized");
    const selectedWallet = await (await this.selector).wallet();
    await selectedWallet.signOut();
  };

  /**
 * Makes a read-only call to a contract
 * @param {Object} options - the options for the call
 * @param {string} options.contractId - the contract's account id
 * @param {string} options.method - the method to call
 * @param {Object} options.args - the arguments to pass to the method
 * @returns {Promise<JSON.value>} - the result of the method call
 */
  viewMethod = async ({ contractId, method, args = {} }: ViewMethodOptions): Promise<unknown> => {
    const url = `https://rpc.${this.networkId}.near.org`;
    const provider = new providers.JsonRpcProvider({ url });

    const res = await provider.query({
      request_type: "call_function",
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString("base64"),
      finality: "optimistic",
    });

    // @ts-expect-error mismatch
    return JSON.parse(Buffer.from(res.result).toString());
  };

  /**
   * Makes a call to a contract
   * @param {Object} options - the options for the call
   * @param {string} options.contractId - the contract's account id
   * @param {string} options.method - the method to call
   * @param {Object} options.args - the arguments to pass to the method
   * @param {string} options.gas - the amount of gas to use
   * @param {string} options.deposit - the amount of yoctoNEAR to deposit
   * @returns {Promise<Transaction>} - the resulting transaction
   */
  callMethod = async ({
    contractId,
    method,
    args = {},
    gas = THIRTY_TGAS,
    deposit = NO_DEPOSIT,
  }: CallMethodOptions): Promise<providers.FinalExecutionOutcome> => {
    if (!this.selector) throw new Error("Wallet not initialized");

    const selectedWallet = await (await this.selector).wallet();
    const outcome = await selectedWallet.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: method,
            args,
            gas,
            deposit,
          },
        },
      ],
    });

    if (!outcome) throw new Error("Transaction failed");
    return outcome as providers.FinalExecutionOutcome;
  };

  /**
  * Retrieves transaction result from the network
  * @param {string} txhash - the transaction hash
  * @returns {Promise<JSON.value>} - the result of the transaction
  */
  getTransactionResult = async (txhash: string): Promise<unknown> => {
    if (!this.selector) throw new Error("Wallet not initialized");

    const walletSelector = await this.selector;
    const { network } = walletSelector.options;
    const provider = new providers.JsonRpcProvider({ url: network.nodeUrl });

    const transaction = await provider.txStatus(txhash, "unnused");
    return providers.getTransactionLastResult(transaction);
  };
}
