import React, { useState, useEffect } from 'react';
import { addUserAddress } from '@/hooks/addUserAddress';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { MoonSDK} from '@moonup/moon-sdk';

interface AddAddressComponentProps {
  userAddresses: string[];
  onAddressAdded: () => void;
  onBack: () => void;
  moon: MoonSDK;
}

const AddAddressComponent: React.FC<AddAddressComponentProps> = ({ userAddresses, onAddressAdded, onBack, moon }) => {
  const [newAddressName, setNewAddressName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {createAccount } = useMoonSDK();
  useEffect(() => {
    console.log('moon', moon);
}, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (!moon) {
        throw new Error('Moon SDK is not initialized');
      }
      const newAccount = await moon.getAccountsSDK().createAccount({}); // Adjust based on actual API
      await addUserAddress(newAccount, newAddressName);
      onAddressAdded();
    } catch (err) {
      console.error(err);
      setError('Failed to add address');
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
