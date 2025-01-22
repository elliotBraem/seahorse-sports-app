const contractPerNetwork: Record<string, string> = {
  testnet: "guestbook.near-examples.testnet",
};

export const NETWORK_ID: string = "testnet";
export const GuestbookNearContract: string = contractPerNetwork[NETWORK_ID];
