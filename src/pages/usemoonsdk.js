import { MoonSDK } from "@moonup/moon-sdk";
import { useState } from "react";
import { AUTH, MOON_SESSION_KEY, Storage } from "@moonup/moon-types";
import { CreateAccountInput } from "@moonup/moon-api";

export const useMoonSDK = () => {
  //state variable that sets up Moon for us!
  const [moon, setMoon] = useState(null);

  //set up/initialize MoonSDK instance
  const initialize = async () => {
    const moonInstance = new MoonSDK({
        Storage: {
            key: MOON_SESSION_KEY,
            type: Storage.SESSION,
        },
        Auth: {
            AuthType: AUTH.JWT,
        },

    });
    //setting Moon
    setMoon(moonInstance);
    moonInstance.connect();
  };

  const connect = async () => {
    if (moon) {
      return moon.connect();
    }
  };

  const updateToken = async (token, refreshToken) => {
    if (moon) {
      moon.updateToken(token);
      moon.updateRefreshToken(refreshToken);

      moon.connect();
    }
  };

  const createAccount = async () => {
    if (moon) {
      const data = {};
      const newAccount = await moon?.getAccountsSDK().createAccount(data);
      return newAccount;
    }
  };

  const disconnect = async () => {
    if (moon) {
      await moon.disconnect();
      sessionStorage.removeItem(MOON_SESSION_KEY);
      setMoon(null);
    }
  };
  return {
    moon,
    initialize,
    connect,
    updateToken,
    createAccount,
    disconnect,
  }
}
