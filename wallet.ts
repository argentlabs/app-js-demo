import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import { Account, defaultProvider, ec, KeyPair } from "starknet";

export const useWallet = () => {
  const [keyPair, setKeyPair] = useState<KeyPair>();
  const [reloadTrigger, setReloadTrigger] = useState(false);
  useEffect(() => {
    setReloadTrigger(false);
    if (reloadTrigger) {
      setKeyPair(undefined);
    }
    // load keypair from storage or generate new one
    AsyncStorage.getItem("secret").then(async (secret) => {
      if (!keyPair) {
        // secret = stark.randomAddress();
        secret =
          "0x39FB5B7E20F22BA5FFCEE99251E96074BE964CDAEB73C7512B0337D117F3EDD";
        await AsyncStorage.setItem("secret", secret);
      }
      setKeyPair(ec.getKeyPair(secret));
    });
  }, [reloadTrigger]);

  const publicKey = useMemo(() => {
    if (!keyPair) {
      return;
    }
    return ec.getStarkKey(keyPair);
  }, [keyPair]);
  const address = useMemo(() => {
    // return calculateContractAddress();
    return publicKey
      ? "0x002fc8867e8756705985fd2054d3145d609b255b298fe7d28aef10d1f96d0e6e"
      : undefined;
  }, [publicKey]);

  const account = useMemo(() => {
    if (!address || !keyPair) {
      return;
    }
    return new Account(defaultProvider, address, keyPair);
  }, [address, keyPair]);

  return {
    publicKey,
    address,
    account,
    isLoading: Boolean(!publicKey),
    reload: () => setReloadTrigger(true),
  };
};
