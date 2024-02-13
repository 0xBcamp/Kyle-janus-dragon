import {MoonSigner, MoonSignerConfig} from '@moonup/ethers';
import { MoonSDK, Accounts} from '@moonup/moon-sdk';
import { AUTH, MOON_SESSION_KEY, Storage} from '@moonup/moon-types';
import { useState } from 'react';
import { utils, BigNumber } from 'ethers';

const ethers = require('ethers');
export const useMoonSDK = () => {
	const [moon, setMoon] = useState<MoonSDK | null>(null);
	
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
		setMoon(moonInstance);
		await moonInstance.connect();
		return moonInstance;
	};

	const connect = async () => {
		if (moon) {
			return await moon.connect();
		}
	};

	const updateToken = async (token: string, refreshToken: string) => {
		if (moon) {
			moon.updateToken(token);
			moon.updateRefreshToken(refreshToken);

			moon.connect();
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
		disconnect,
	};
};
