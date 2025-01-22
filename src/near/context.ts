import { createContext, useContext } from 'react';
import { Wallet } from './wallet';

interface NearContextType {
  wallet: Wallet;
  signedAccountId?: string;
}

export const NearContext = createContext<NearContextType>({
  wallet: {} as Wallet,
  signedAccountId: undefined,
});

export const useNear = () => useContext(NearContext);
