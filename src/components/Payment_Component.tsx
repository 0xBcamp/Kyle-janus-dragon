import React, { useState, useEffect } from 'react';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { getAddressBalance, getChainIdInfo, sendCoin } from '@/utils/moonSDKUtils';

const ethers = require('ethers');
interface PaymentComponentProps {
  address: string;
  addressName: string;
  onBack: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ address, addressName, onBack }) => {
  const { moon, initialize} = useMoonSDK();
  const [balance, setBalance] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(true);
  // Initialize chainIdName and coin with 'Loading...' to indicate they are being fetched.
  const [chainIdName, setChainIdName] = useState<string>('Loading...');
  const [coin, setCoin] = useState<string>('Loading...');
  const [decimal, setDecimal] = useState<number>(18); // Assuming a default decimal value
  const [amountToSend, setAmountToSend] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');

  useEffect(() => {
    handleRefreshBalance(); // Call handleRefreshBalance when component mounts
  }, []);

  const handleSendCoin = async () => {
    if (!moon) {
      console.error('Moon SDK is not initialized');
      return;
    }
  
    const chainId = "1891"; // Example chainId, adjust as needed
    try {
      // Convert amountToSend from MATIC to Wei
      const amountInWei = ethers.utils.parseUnits(amountToSend, 'ether');
      // Pass the amount in Wei to sendCoin
      await sendCoin(address, recipientAddress, chainId, amountInWei);
      alert('Transaction successful!');
      handleRefreshBalance(); // Refresh balance to reflect the transaction
    } catch (error) {
      console.error('Error sending coin:', error);
      alert('Transaction failed: ' + error.message);
    }
  };
  
  

  const handleGetBalance = async () => {
    await initialize();
    if (moon) {
      setLoading(true);
      try {
        const chainId = "1891"; // Example chainId, adjust as needed
        const balanceResponse = await getAddressBalance(moon, address, chainId);
        const chainInfo = await getChainIdInfo(chainId);
        
        if (chainInfo) {
          const [chainName, coinName, decimalValue] = chainInfo;
          // setChainIdName(chainName);
          // setCoin(coinName);
          // setDecimal(decimalValue);
          // const adjustedBalance = balanceResponse / Math.pow(10, decimalValue);
          // setBalance(adjustedBalance);
        } else {
          // Update to default or error state if chain info cannot be fetched
          setChainIdName('Chain info not available');
          setCoin('');
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Handle error state for chainIdName and coin
        setChainIdName('Error fetching chain info');
        setCoin('');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('That\'s no moon');
    }
  };

  const handleRefreshBalance = () => {
    handleGetBalance();
  };

  return (
    <div>
      <p><strong>Chain:</strong> {chainIdName} {coin !== 'Loading...' && `(${coin})`}</p>
      <p><strong>{addressName}:</strong> {address}</p>

      {loading ? (
        <p><strong>Balance:</strong> loading...</p>
      ) : (
        <p><strong>Balance:</strong> {balance ? balance.toFixed(4) : '0'} {coin}</p>
      )}
      <div>
        <label>
          Recipient Address:
          <input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
        </label>
      </div>
        <div>
          <label>
            Amount to Send ({coin}):
            <input type="number" value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} />
          </label>
        </div>
        <button onClick={handleRefreshBalance}>Refresh</button>
        <button onClick={() => handleSendCoin()}>Send</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default PaymentComponent;
