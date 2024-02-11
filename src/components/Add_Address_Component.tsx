import React, { useState, useEffect } from 'react';
import { addUserAddress } from '@/hooks/addUserAddress';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { MoonSDK} from '@moonup/moon-sdk';
import { deleteAccount } from '@/utils/moonSDKUtils';
interface AddAddressComponentProps {
  userAddresses: string[];
  onAddressAdded: () => void;
  onBack: () => void;
  moon: MoonSDK;
  email: string;
}

const AddAddressComponent: React.FC<AddAddressComponentProps> = ({ userAddresses, onAddressAdded, onBack, moon, email }) => {
  const [newAddressName, setNewAddressName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    let newAddress: string | null = null; // Keep track of the new address to potentially delete it
  
    try {
      if (!moon) {
        throw new Error('Moon SDK is not initialized');
      }
  
      // Attempt to create a new account
      const newAccount = await moon.getAccountsSDK().createAccount({});
      console.log(newAccount);
      newAddress = newAccount.data.data.address; // Correctly update the outer newAddress variable
  
      // Attempt to add the user address, this might throw if it fails
      await addUserAddress(newAddress, newAddressName, email);
      
      // If addUserAddress succeeds, invoke the callback
      onAddressAdded();
    } catch (err) {
      console.error(err);
      setError(String(err));
  
      // If adding the user address fails and a new address was created, attempt to delete it
      if (newAddress) {
        try {
          await deleteAccount(moon, newAddress);
        } catch (deleteErr) {
          console.error('Failed to delete account after addUserAddress failed:', deleteErr);
        }
      }
    } finally {
      setLoading(false);
    }
  };  


  return (
    <div>
      <input
        type="text"
        placeholder="Name of the new address"
        value={newAddressName}
        onChange={(e) => setNewAddressName(e.target.value)}
        disabled={loading}
      />
      <button onClick={handleSubmit} disabled={loading}>
        Add Address
      </button>
      <button onClick={onBack} disabled={loading}>
        x
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default AddAddressComponent;
