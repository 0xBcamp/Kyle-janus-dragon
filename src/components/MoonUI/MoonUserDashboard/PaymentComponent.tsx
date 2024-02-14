/**
 * File: PaymentComponent
 * Description: Component for managing payments and address operations in a blockchain context.
 *              Allows users to send cryptocurrency, check their balance, and rename addresses.
 *
 * Props:
 *     -email: variable that keeps track of the user's email to perform data retrieval functions
 *     -onDisconnect: prop that will call setCurrentAddress(null) in this component's parent to exit this component
 *     -moon: variable that keeps track of MoonSDK to interact with Moon
 *
 * Author: Team Kyle
 * Last Modified: 2/13/23
 */

import React, { useState, useEffect } from "react";
import {
  getAddressBalance,
  getChainIdInfo,
  sendCoin,
} from "@/utils/moonSDKUtils";
import { MoonSDK } from "@moonup/moon-sdk";
import { renameAddress } from "@/services/renameAddress";
import { checkIfAddressNameExists } from "@/services/checkIfAddressNameExists";
const ethers = require("ethers");

interface PaymentComponentProps {
  moon: MoonSDK;
  address: string;
  addressName: string;
  onBack: () => void;
  email: string;
  onRenameResult: (success: boolean, newAddressName: string) => void; // Add this prop
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  email,
  moon,
  address,
  addressName,
  onBack,
  onRenameResult,
}) => {
  const [balance, setBalance] = useState<number | null>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [chainIdName, setChainIdName] = useState<string>("Ethereum"); // Default to Ethereum
  const [chainId, setChainId] = useState<string>("1"); // Ethereum's chain ID as default
  const [coin, setCoin] = useState<string>("Loading...");
  const [decimal, setDecimal] = useState<number>(18); // Assuming a default decimal value
  const [amountToSend, setAmountToSend] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [sendStatusMessage, setSendStatusMessage] = useState<string>("");
  const [renameStatusMessage, setRenameStatusMessage] = useState<
    "idle" | string
  >("idle");
  const [renaming, setRenaming] = useState<boolean>(false);
  const [newAddressName, setNewAddressName] = useState<string>("");

  useEffect(() => {
    handleRefreshBalance(); // Call handleRefreshBalance when component mounts
  }, []); // Add chainId as a dependency so it refreshes the balance when changed

  /*****copyToClipboard()*****/
  //function that copies an address to a user's clipboard upon clicking
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess("Address copied!");
    } catch (err) {
      setCopySuccess("Failed to copy!");
    }
  };

  /*****toggleAddressRename()*****/
  //function that toggles whether or not an address is being renamed!
  const toggleAddressRename = async () => {
    setRenaming(!renaming);
    setNewAddressName("");
    setRenameStatusMessage("idle");
  };

  /*****handleRenameAddress()*****/
  //function that handles the logic of renaming an address
  const handleRenameAddress = async () => {
    //if the name is the same as its current name, do nothing
    if (newAddressName == addressName) {
      toggleAddressRename();
      setNewAddressName("");
    }

    //if the address name is unique to the user, rename the address to that!
    const addressNameExists = await checkIfAddressNameExists(
      email,
      newAddressName
    );
    if (!addressNameExists) {
      const renameAddressSuccess = await renameAddress(address, newAddressName);
      if (renameAddressSuccess) {
        onRenameResult(true, newAddressName);
        toggleAddressRename();
        setNewAddressName("");
      }
      onRenameResult(false, "");
    } else {
      onRenameResult(false, "");
      setRenameStatusMessage(
        "Name already exists, please name it something else!"
      );
    }
  };

  const handleGetBalance = async (currentChainId) => {
    if (moon) {
      setLoading(true);
      try {
        const balanceResponse = await getAddressBalance(moon, address, currentChainId);
        console.log(currentChainId);
        const chainInfo = await getChainIdInfo(currentChainId);
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
          setChainIdName("Chain info not available");
          setCoin("");
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        // Handle error state for chainIdName and coin
        setCoin("");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("That's no moon");
    }
  };

  const handleRefreshBalance = () => {
    handleGetBalance(chainId);
  };

  const handleChainChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChain = e.target.value;
    console.log(selectedChain);
    const chainIds = {
      Ethereum: "1",
      Lightlink: "1891",
    };
    setChainId(chainIds[selectedChain]);
    setChainIdName(selectedChain);
    await handleGetBalance(chainIds[selectedChain]);
  };

  const handleSendCoins = async () => {
    if (
      !moon ||
      !recipientAddress ||
      amountToSend === "" ||
      isNaN(Number(amountToSend))
    ) {
      console.error("Invalid input");
      setSendStatusMessage("Invalid input");
      setSendStatus("error");
      return;
    }

    try {
      setLoading(true);
      const [transactionHash, amountEthSent] = await sendCoin(
        moon,
        address,
        recipientAddress,
        chainId,
        amountToSend
      );
      console.log("Coins sent successfully");
      console.log(transactionHash);
      setSendStatusMessage(
        `Transaction successful: \n Amount=${amountEthSent} ETH \n Hash = \n ${transactionHash}` 
      );
      setSendStatus("success");
      setAmountToSend("");
      setRecipientAddress("");
      handleRefreshBalance(); // Optionally refresh balance after sending
    } catch (error) {
      console.error("Error sending coins:", error);
      const errorMessage = error.error.message;
      setSendStatusMessage(errorMessage);
      setSendStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div>
        <strong className="tab">Chain:</strong>
        <select
          className="payment"
          onChange={handleChainChange}
        >
          <option value="Ethereum">Ethereum Mainnet</option>
          <option value="Lightlink">Lightlink Pegasus Testnet</option>
        </select>
      </div>
      <p>
        <div className="flex-row">
          {renaming ? (
            <div>
              <input
                className="inputty"
                type="text"
                value={newAddressName}
                onChange={(e) => setNewAddressName(e.target.value)}
              />
              <button className="moon-btn4" onClick={handleRenameAddress}>Rename</button>
              <button className="moon-btn4" onClick={toggleAddressRename}>x</button>
              {renameStatusMessage !== "idle" && <p className="text-xs">{renameStatusMessage}</p>}
            </div>
          ) : (
            <strong className="tab">{addressName}:</strong>
          )}
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => copyToClipboard(address)}
            className="tab"
          >
            {address}
          </span>
        </div>
      </p>

      {loading ? (
        <p>
          <strong className="tab">Balance:</strong> loading...
        </p>
      ) : (
        <p>
          <strong className="tab">Balance:</strong>{" "}
          {balance ? balance.toFixed(4) : "0"} ETH{" "}
        </p>
      )}
      <div>
        <label className="tab">
          Recipient Address:
          <input
            className="input"
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Amount to Send in ETH:
          <input
            className="input"
            type="number"
            value={amountToSend}
            onChange={(e) => setAmountToSend(e.target.value)}
          />
        </label>
      </div>
      {sendStatus !== "idle" && (
        <pre className="text-xs" style={{ color: sendStatus === "success" ? "green" : "red" }}>
          {sendStatusMessage}
        </pre>
      )}
      <button className="moon-btn4" onClick={handleSendCoins}>
        Send
      </button>
      <p>
        Currently, Moon Wallet UI only supports ETH transactions
      </p>
      <div className="moon-cont2">
        {!renaming && (
          <button className="moon-btn4" onClick={toggleAddressRename}>
            Rename this address
          </button>
        )}
        <button className="moon-btn4" onClick={handleRefreshBalance}>
          Refresh
        </button>
        <button className="moon-btn4" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

export default PaymentComponent;
