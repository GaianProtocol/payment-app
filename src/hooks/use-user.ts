'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import authSolApi from '@/services/authSol.service';
import { IProfileUser, PrivyUser } from '@/types/auth.type';
import { ACCESS_TOKEN } from '@/utils/constant';
import { ConnectedSolanaWallet, PrivyInterface, usePrivy, } from '@privy-io/react-auth';
import { useSolanaWallets } from "@privy-io/react-auth/solana";
import base58 from 'bs58';
import useSWR from 'swr';

type UserInterface = Omit<PrivyInterface, 'user' | 'ready'> & {
  isLoading: boolean;
  user: IProfileUser | null;
  fetchUser: ({
    signRequired,
  }: {
    signRequired?: boolean;
  }) => Promise<IProfileUser | null>;
};


function loadFromCache(): IProfileUser | null {
  try {
    const cached = localStorage.getItem('user-data');
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    return null;
  }
}

function saveToCache(data: IProfileUser | null) {
  try {
    if (data) {
      localStorage.setItem('user-data', JSON.stringify(data));
    } else {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem('user-data');
    }
  } catch (error) {
    console.log('Error saving user data to cache', error);
  }
}

async function fetchUserData(
  privyUser: PrivyUser,
): Promise<IProfileUser | null> {
  try {
    const me = await authSolApi.getProfile();
    if (me) {
      return {
        ...me,
        privyUser: privyUser as PrivyUser,
      } as IProfileUser;
    }
    return null;
  } catch (error) {
    return null;
  }
}

async function checkExpired() {
  const token = localStorage.getItem(ACCESS_TOKEN);
  if (!token) return true;

  try {
    // Assuming token is a JWT formatted as "header.payload.signature"
    const parts = token.split(".");
    if (parts.length !== 3) {
      // Token is not a valid JWT structure
      console.error("Invalid token format");
      return true;
    }

    // Decode the payload part only
    const payload = JSON.parse(atob(parts[1]));
    const now = Date.now() / 1000;
    return now >= payload.exp;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
}
async function onSignSolWallet(wallet: ConnectedSolanaWallet) {
  const isExpired = await checkExpired();
  if (!wallet || !isExpired) return;
  const addressPubkey = wallet?.address.toString();
  const result = await authSolApi.requestNonce(addressPubkey!);
  const { nonce, publicAddress } = result as any;

  const msg = new TextEncoder().encode(`${nonce}`);
  const res = await wallet.signMessage(msg);
  const bytes = Uint8Array.from(res);
  const messageSignedBase58 = base58.encode(bytes);
  const data = await authSolApi.login(publicAddress, messageSignedBase58, nonce, {
  });

  if (data.token) {
    localStorage.setItem(ACCESS_TOKEN, data.token);
  } else {
    // TODO display error
  }
};

export function useUser(): UserInterface {
  const { ready, user: privyUser, ...privyRest } = usePrivy();
  const { wallets, ready: walletsReady } = useSolanaWallets();
  const wallet = useMemo(
    () => wallets.find((w) => w.address === privyUser?.wallet?.address),
    [wallets, privyUser]
  );

  const [initialCachedUser, setInitialCachedUser] = useState<IProfileUser | null>(
    null,
  );

  // Load cached user data on component mount
  useEffect(() => {
    const cachedUser = loadFromCache();
    setInitialCachedUser(cachedUser);
  }, []);

  // Define SWR key based on Privy authentication state
  const swrKey = wallet && ready && privyUser?.id ? `user-${privyUser.id}` : null;

  const fetcher = useCallback(async ({
    signRequired = true,
  }): Promise<IProfileUser | null> => {
    if (!ready || !privyUser) {
      return null;
    }
    if (privyUser) {

      if (wallet && signRequired) {
        await onSignSolWallet(wallet);
      }
      const user = await fetchUserData(privyUser as PrivyUser);

      if (user) {
        saveToCache(user);
      }
      return user;
    }

    return null;
  }, [ready, privyUser, wallet,]);


  // Use SWR for data fetching and state management
  const { data: user, isValidating: swrLoading } = useSWR<IProfileUser | null>(
    swrKey,
    fetcher,
    {
      fallbackData: initialCachedUser,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  );

  // Update cache when new user data is fetched
  useEffect(() => {
    if (user) {
      saveToCache(user);
    }
  }, [user]);

  const isLoading = swrLoading && !initialCachedUser;

  const extendedLogout = useCallback(async () => {
    try {
      saveToCache(null);
      setInitialCachedUser(null);
      await privyRest.logout();
      if (wallet) {
        wallet.disconnect();
      }
    } catch (error) {
      console.log('Error logging out:', error);
      window.location.reload();
    }
  }, [privyRest, wallet]);

  useEffect(() => {
    if (!privyUser || !privyUser.wallet) return

    if (walletsReady && wallets.length === 0) {
      extendedLogout();
    } else if (walletsReady && wallets.length > 0) {
      const wallet = wallets.find((w) => w.address === privyUser?.wallet?.address)
      if (!wallet) {
        extendedLogout();
      }
    }


  }, [wallets, privyUser, walletsReady]);

  const extendedLogin = useCallback(async () => {
    try {
      const jwt = localStorage.getItem(ACCESS_TOKEN);
      if (jwt && privyRest.authenticated && privyUser) {
        await extendedLogout();
      }
      privyRest.login();
    } catch (error) {
      console.log('Error logging in:', error);
    }
  }, [privyRest, wallets, privyUser]);

  return {
    ...privyRest,
    isLoading: isLoading || user == null,
    user: ready ? (privyUser ? user || null : null) : initialCachedUser || null,
    logout: extendedLogout,
    login: extendedLogin,
    fetchUser: fetcher,
  };
}
