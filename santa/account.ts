import { Wallet } from "@near-wallet-selector/core";
import { JsonRpcProvider } from "near-api-js/lib/providers";
import { utils } from "near-api-js";
import CryptoJS from "crypto-js";
import uuid4 from "uuid4";
import { DefaultStrategy } from "./Strategy";
import Api from "./api";

const BOATLOAD_OF_GAS = utils.format.parseNearAmount("0.00000000003")!;

class Account {
  api = new Api();
  hashes: Record<string, string> = {};
  phone: string | null = null;

  constructor(
    readonly accountId: string,
    readonly wallet: Wallet,
    readonly provider: JsonRpcProvider
  ) {}

  getDeviceID() {
    const id = window.localStorage.getItem("deviceID") ?? uuid4();
    window.localStorage.setItem("deviceID", id);
    return id;
  }

  /** Memoize phone hash (+ prefix agnostic)*/
  async getPhoneHash(phone: string) {
    const formatted = "+" + phone.replace("+", "");

    if (this.hashes[formatted]) {
      return this.hashes[formatted];
    }

    const { hash } = await this.api.getPhoneHash(formatted);
    this.hashes[formatted] = hash;
    return hash;
  }

  async sendSanta(phone: string, amount: string, comment: string) {
    const strategy = new DefaultStrategy();
    if (this.wallet.id === "here-wallet") {
      strategy.onInitialized();
    }

    const hash = await this.getPhoneHash(phone);
    await this.wallet.signAndSendTransaction({
      strategy,
      receiverId: "santa_token.near",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "ft_transfer_call",
            args: {
              receiver_id: "phone.herewallet.near",
              amount: amount,
              comment: this.encodeComment(phone, comment),
              msg: hash,
            },
            gas: "50" + "0".repeat(12),
            deposit: "1",
          },
        },
      ],
    } as any);
  }

  encodeComment(phone: string, msg: string) {
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(msg, CryptoJS.SHA256(phone), {
      format: CryptoJS.format.Hex,
      mode: CryptoJS.mode.CBC,
      iv,
    });

    const base64 = iv
      .clone()
      .concat(encrypted.ciphertext)
      .toString(CryptoJS.enc.Base64);

    return base64;
  }

  async sendMoney(phone: string, amount: string, comment: string) {
    const strategy = new DefaultStrategy();
    strategy.onInitialized();

    const hash = await this.getPhoneHash(phone);
    await this.wallet.signAndSendTransaction({
      strategy,
      receiverId: "phone.herewallet.near",
      actions: [
        {
          type: "FunctionCall",
          params: {
            methodName: "send_near_to_phone",
            args: { phone: hash, comment: this.encodeComment(phone, comment) },
            deposit: utils.format.parseNearAmount(amount) ?? "1",
            gas: BOATLOAD_OF_GAS,
          },
        },
      ],
    } as any);
  }

  async checkRegistration(phone: string) {
    const hash = await this.getPhoneHash(phone);
    const args = JSON.stringify({ phone: hash });

    const res = await this.provider.query<any>({
      request_type: "call_function",
      account_id: process.env.REACT_APP_CONTRACT,
      method_name: "get_account_id",
      args_base64: Buffer.from(args).toString("base64"),
      finality: "optimistic",
    });

    const data = JSON.parse(Buffer.from(res.result).toString());
    return data;
  }

  async logout() {
    await this.wallet.signOut();
  }
}

export default Account;
