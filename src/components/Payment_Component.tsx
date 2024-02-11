import React, { useState, useEffect } from 'react';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { getAddressBalance, getChainIdInfo, sendCoin } from '@/utils/moonSDKUtils';
import { MoonSDK } from '@moonup/moon-sdk';
const ethers = require('ethers');

interface PaymentComponentProps {
  moon: MoonSDK;
  address: string;
  addressName: string;
  onBack: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ moon, address, addressName, onBack }) => {
  const [balance, setBalance] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [chainIdName, setChainIdName] = useState<string>('Ethereum'); // Default to Ethereum
  const [chainId, setChainId] = useState<string>('1'); // Ethereum's chain ID as default
  const [coin, setCoin] = useState<string>('Loading...');
  const [decimal, setDecimal] = useState<number>(18); // Assuming a default decimal value
  const [amountToSend, setAmountToSend] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');


  useEffect(() => {
    handleRefreshBalance(); // Call handleRefreshBalance when component mounts
  }, [chainId]); // Add chainId as a dependency so it refreshes the balance when changed

  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Address copied!');
    } catch (err) {
      setCopySuccess('Failed to copy!');
    }
  };

  const handleGetBalance = async () => {
    if (moon) {
      setLoading(true);
      try {
        const balanceResponse = await getAddressBalance(moon, address, chainId);
        console.log(chainId);
        const chainInfo = await getChainIdInfo(chainId);
        console.log(chainInfo);
        
        if (chainInfo) {
          const [chainName, coinName, decimalValue] = chainInfo;
          setChainIdName(chainName);
          setCoin(coinName);
          setDecimal(decimalValue);
          const adjustedBalance = balanceResponse / Math.pow(10, decimalValue);
          setBalance(adjustedBalance);
        } else {
          // Update to default or error state if chain info cannot be fetched
          setChainIdName('Chain info not available');
          setCoin('');
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
        // Handle error state for chainIdName and coin
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

  const handleChainChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChain = e.target.value;
    console.log(selectedChain);
    const chainIds = {
      'Ethereum': '1',
      'Lightlink': '1891',
    };
    setChainId(chainIds[selectedChain]);
    setChainIdName(selectedChain);
  };

  const handleSendCoins = async () => {
    if (!moon || !recipientAddress || amountToSend === '' || isNaN(Number(amountToSend))) {
      console.error('Invalid input');
      setStatusMessage('Invalid input');
      setSendStatus('error');
      return;
    }

    try {
      setLoading(true);
      const [transactionHash, amountEthSent ]= await sendCoin(moon, address, recipientAddress, chainId, amountToSend);
      console.log('Coins sent successfully');
      console.log(transactionHash);
      setStatusMessage(`Transaction successful: Hash=${transactionHash}, Amount=${amountEthSent} ETH`);
      setSendStatus('success');
      setAmountToSend('');
      setRecipientAddress('');
      handleRefreshBalance(); // Optionally refresh balance after sending
    } catch (error) {
      console.error('Error sending coins:', error);
      const errorMessage = error.error.message;
      setStatusMessage(errorMessage);
      setSendStatus('error');
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div>
      <div>
      <strong>Chain:</strong>
        <select value={chainIdName} onChange={handleChainChange}>
          <option value="Ethereum">Ethereum Mainnet</option>
          <option value="Lightlink">Lightlink Pegasus Testnet</option>
        </select>
      </div>
      <p>
        <strong>
          {addressName}:
        </strong>        
        <span 
          style={{ cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => copyToClipboard(address)}
        >
            {address}
        </span>
      </p>

      {loading ? (
        <p><strong>Balance:</strong> loading...</p>
      ) : (
        <p><strong>Balance:</strong> {balance ? balance.toFixed(4) : '0'} ETH </p>
      )}
      <div>
        <label>
          Recipient Address:
          <input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Amount to Send in ETH:
          <input type="number" value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} />
        </label>
      </div>
      {sendStatus !== 'idle' && (
        <p style={{ color: sendStatus === 'success' ? 'green' : 'red' }}>{statusMessage}</p>
      )}
      <button onClick={handleSendCoins}>Send</button>
      <p>At the moment, this Moon Wallet UI only supports Ethereum transactions</p>
      <button onClick={handleRefreshBalance}>Refresh</button>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default PaymentComponent;
