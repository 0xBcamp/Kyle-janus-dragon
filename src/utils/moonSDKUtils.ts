// utils/moonSDKUtil.ts
import { MoonSDK, CreateAccountInput } from '@moonup/moon-sdk';
import { AUTH, MOON_SESSION_KEY, Storage } from '@moonup/moon-types';
import { ethers } from 'ethers'; 
import { raw } from 'mysql2';

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
    const signedTransactionData = await moonInstance.getAccountsSDK().signTransaction(account, transactionData);
    const rawTransaction = signedTransactionData.data.data.transactions[0].raw_transaction;
    const transactionHash = signedTransactionData.data.data.transactions[0].transaction_hash;
    const transactionValueWei =  signedTransactionData.data.data.transactions[0].transaction.value;

    // Convert the value from Wei to Ether
    const transactionValueEth = ethers.utils.formatEther(transactionValueWei);
    
    // Now, broadcast the signed transaction
    // Make sure the `broadcastTx` method accepts the signed transaction in the format returned by `signTransaction`
    const broadcastInput = {
      chainId: chainId,
      rawTransaction: rawTransaction
    }
    const broadcastResponse = await moonInstance.getAccountsSDK().broadcastTx(account, broadcastInput);
    console.log("Transaction signed and sent: ", signedTransactionData);
    return [transactionHash, transactionValueEth];
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
    console.log(data);
    const balanceRaw = data.data.balance; // Raw balance in smallest unit
    return balanceRaw;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error;
  }
};

// Function to get chain ID info
export const getChainIdInfo = async (chainId: string) => {
  if (chainId == '1') {
    return ["Ethereum", "Ethereum", 18];
  }
  else if (chainId == '1891') {
    return ["Lightlink", "Ethereum", 18];
  }
  else{
    return [null, null, null];
  }
};