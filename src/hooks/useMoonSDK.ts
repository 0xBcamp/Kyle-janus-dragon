import { CreateAccountInput, InputBody } from '@moonup/moon-api/';
import {MoonSigner, MoonSignerConfig} from '@moonup/ethers';
import { MoonSDK} from '@moonup/moon-sdk';
import { AUTH, MOON_SESSION_KEY, Storage } from '@moonup/moon-types';
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
		moonInstance.connect();
	};

	const connect = async () => {
		if (moon) {
			return moon.connect();
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
			console.log(moon?.getAccountsSDK())
			console.log(newAccount)
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

	const getUserAddresses = async () => {
		if (moon) {
			const addresses = await moon.listAccounts();
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
		if (chainId='80001'){
			return ["Mumbia", "Polygon", 18];
		}
		else if(chainId='1891'){
			return ["LightLink", "Ethereum", 18];
		}
		else{
			return [null, null, null];
		}
	  };
	  const sendCoin = async (address, toAddress, chainId, amountEth) => {
		try {
		  // Ensure moon is initialized and connected before proceeding
		  if (!moon) {
			await initialize(); // Make sure initialize is complete
			// Consider checking if moon is properly connected or initialized here
		  }
	  
		  // Proceed if moon is initialized and connected
		  if (moon) {
			let provider = new ethers.providers.JsonRpcProvider('https://mumbai.rpc.thirdweb.com/');
			const amountInWei = ethers.utils.parseUnits(amountEth.toString(), 18);
	  
			// Adjusted MoonSignerConfig object according to SDK requirements
			const signerConfig = {
			  SDK: moon as MoonSDK, // Ensure this matches the expected structure for MoonSigner
			  address: address,
			  chainId: chainId,
			};
			console.log("Converted amountInWei:", amountInWei); // Ensure this is not undefined
			console.log("Transaction toAddress:", toAddress); // Verify recipient address
			console.log("Transaction chainId:", chainId); // Confirm chain ID
			console.log("gas:", ethers.BigNumber.from("21000"));
			const signer = new MoonSigner(signerConfig, provider);
			const transaction = await signer.sendTransaction({
			  to: toAddress,
			  value: amountInWei,
			  gasLimit:ethers.BigNumber.from("21000"), // Example, adjust as needed
			});
			console.log(transaction);
		  }
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
		sendCoin
	};
};
