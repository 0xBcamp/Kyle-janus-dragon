import { CreateAccountInput, InputBody} from '@moonup/moon-api/';
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

	const createAccount = async () => {
		if (moon) {
			const data: CreateAccountInput = {};
			const newAccount = await moon?.getAccountsSDK().createAccount(data);
			console.log(moon?.getAccountsSDK());
			console.log(newAccount);
			console.log(moon.listAccounts());
			return newAccount;
		}
		else{
			console.log('no moon')
		}
	};
	const deleteAccount = async (account) =>{
		if (moon){
			await moon?.getAccountsSDK().deleteAccount(account);
			return true;
		}
		else{
			return false;
		}
	}

	const disconnect = async () => {
		if (moon) {
			await moon.disconnect();
			sessionStorage.removeItem(MOON_SESSION_KEY);
			setMoon(null);
		}
	};

	const getUserAddresses = async () => {
		if (moon) {
			const addresses = await moon.listAccounts();
			console.log(addresses);
			const keys = addresses.data.keys; // Assuming addresses.data correctly contains an AccountResponse
			if (keys) { // First, check if keys is not undefined
				return(keys); 
			} else {
				console.log("No keys found in the response.");
			}
		}
	};
	const getAddressBalance = async (address, chainId) => {
		try {
		  if (moon) {
			const query = {
			  chainId: chainId,
			};
			const response = await moon.getAccountsSDK().getBalance(address, query);
			const data =response.data;
			const balanceRaw = data.data.balance; // Raw balance in smallest unit
			return balanceRaw;
		  }
		} catch (error) {
		  console.error("Error fetching balance:", error);
		  // You can handle the error or return an error response as needed
		  throw error;
		}
	  };
	  const getChainIdInfo = async (chainId) => {
		if (chainId=='1891'){
			return ["LightLink", "Ethereum", 18];
		}
		else{
			return [null, null, null];
		}
	  };
	  const sendCoin = async (account, toAddress, chainId, amountEth) => {
		try {
		  // Assuming `moon` is initialized and connected elsewhere in your code
		  if (!moon) {
			console.error("Moon SDK is not initialized");
			return;
		  }
	  
		  // Setup Accounts SDK with authorization token
		  const accountsSDK = moon.getAccountsSDK();
;
	  
		  // Prepare transaction data
		  const amountInWei = ethers.utils.parseUnits(amountEth.toString(), 'ether');
		  const transactionData = {
			to: toAddress,
			value: amountInWei.toString(),
			chain_id: chainId,
			encoding: 'utf-8'
		  };
	  
		  // Sign and send the transaction
		  const message = await accountsSDK.signTransaction(account, transactionData);
		  console.log("Transaction signed and sent: ", message);
		} catch (error) {
		  console.error("Error sending coin:", error);
		  throw error;
		}
	  };
	  
	return {
		moon,
		initialize,
		connect,
		updateToken,
		createAccount,
		disconnect,
		getUserAddresses,
		getAddressBalance,
		getChainIdInfo,
		sendCoin,
		deleteAccount,
	};
};
