export interface SmsRequest {
  amount: string;
  token?: string;
  nft?: string;
  send_to_phone: string;
  transaction_hash: string;
  near_account_id: string;
  comment: string;
}

export enum SmsStatus {
  undelivered = "undelivered",
  delivered = "delivered",
  sent = "sent",
  queued = "queued",
  pending = "pending",
}

class Api {
  private endpoint = "https://api.herewallet.app";

  async fetch(route: string, request: RequestInit) {
    const res = await fetch(`${this.endpoint}/api/v1/${route}`, {
      ...request,
      headers: {
        ...request.headers,
      },
    });

    if (res.status >= 200 && res.status <= 300) {
      return await res.json();
    }

    const data = await res.text();
    throw Error(data);
  }

  async getPhoneHash(phone: string) {
    return this.fetch(`phone/calc_phone_hash?phone=${phone}`, {
      method: "GET",
    });
  }

  async checkSms(trx: string): Promise<{ status: SmsStatus }> {
    return await this.fetch(
      "phone/get_sms_by_transaction?transaction_hash=" + trx,
      { method: "GET" }
    );
  }
}

export default Api;
