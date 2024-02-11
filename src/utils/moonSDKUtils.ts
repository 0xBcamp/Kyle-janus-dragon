// utils/moonSDKUtil.ts
import { MoonSDK, CreateAccountInput } from '@moonup/moon-sdk';
import { AUTH, MOON_SESSION_KEY, Storage } from '@moonup/moon-types';
import { ethers } from 'ethers'; 

// Add other functions as necessary, using moonInstance as an argument
export const createAccount = async (moonInstance: MoonSDK): Promise<any> => {
    const data: CreateAccountInput = {};
    return await moonInstance.getAccountsSDK().createAccount(data);
};

export const deleteAccount = async (moonInstance: MoonSDK, accountAddress: string): Promise<any> => {
  try {
    // Call the deleteAccount method and wait for the response
    const response = await moonInstance.getAccountsSDK().deleteAccount(accountAddress);

    // Check if the response has a body to parse
    // This step depends on the structure of HttpResponse and AccountControllerResponse
    // For illustration, let's assume response.data is what we're interested in:
    if (response && response.data) {
      // Process your response.data as needed
      console.log("Account deletion successful:", response.data);
    } else {
      console.log("Account deletion response received without data.");
    }

    return response; // or return a specific part of the response as needed
  } catch (error) {
    console.error("Failed to delete account:", error);
    throw error; // Rethrow or handle as needed
  }
};

// Example of another function extracted to utility
export const getUserAddressesFromMoon = async (moonInstance: MoonSDK): Promise<any> => {
    const addresses = await moonInstance.listAccounts();
    const keys = addresses.data.keys; // Assuming addresses.data correctly contains an AccountResponse
    if (keys) { // First, check if keys is not undefined
      return(keys); 
    } else {
      console.log("No keys found in the response.");
    }
};

export const sendCoin = async (moonInstance: MoonSDK, account: string, toAddress: string, chainId: string, amountEth: string) => {
  try {
    // Prepare transaction data
    const amountInWei = ethers.utils.parseUnits(amountEth, 'ether');
    const transactionData = {
      to: toAddress,
      value: amountInWei.toString(),
      chain_id: chainId,
      encoding: 'utf-8',
    };
  
    // Sign and send the transaction
    const message = await moonInstance.getAccountsSDK().signTransaction(account, transactionData);
    console.log("Transaction signed and sent: ", message);
  } catch (error) {
    console.error("Error sending coin:", error);
    throw error;
  }
};
export const getAddressBalance = async (moonInstance: MoonSDK, address: string, chainId: string) => {
  try {
    const query = { chainId: chainId };
    const response = await moonInstance.getAccountsSDK().getBalance(address, query);
    const data = response.data;
    const balanceRaw = data.data.balance; // Raw balance in smallest unit
    return balanceRaw;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

// Function to get chain ID info
export const getChainIdInfo = async (chainId: string) => {
  if (chainId === '1891') {
    return ["LightLink", "Ethereum", 18];
  } else {
    return [null, null, null];
  }
};