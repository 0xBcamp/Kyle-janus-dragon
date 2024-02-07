import React, { useState } from 'react';
import { addChosenUserAddress } from '@/hooks/addChosenUserAddress';

interface AddAddressComponentProps {
  userAddresses: string[];
  onAddressAdded: () => void;
  onBack: () => void; // Add this prop to handle back action
  
}

const AddAddressComponent: React.FC<AddAddressComponentProps> = ({ userAddresses, onAddressAdded, onBack }) => {
  const [newAddress, setNewAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const addAddress = async (address: string, newName: string) => {
    setLoading(true);
    setError(null);
    try {
      const { statusCode, message } = await addChosenUserAddress(address, newName);
      if (statusCode === 200) {
        onAddressAdded(); // Trigger the callback to notify the parent component
      } else {
        // Handle non-200 responses by setting the error message
        setError(message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const selectAddress = (address: string) => {
    setSelectedAddress(address);
    setNewAddress('');
    setError(null); // Clear error when a new address is selected
  };

  const unselectAddress = () => {
    setSelectedAddress(null);
    setNewAddress('');
    setError(null); // Clear error when unselecting an address
  };

  return (
    <div>
      <h3>Choose an address to use:</h3>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
        {userAddresses.map((address, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <button onClick={() => selectAddress(address)} style={{ marginRight: '10px' }}>
              {address}
            </button>
            {selectedAddress === address && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="Enter address name"
                />
                <button onClick={() => addAddress(address, newAddress)} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Address'}
                </button>
                <button onClick={unselectAddress}>x</button>
                {error && <span style={{ marginLeft: '10px', color: 'red' }}>{error}</span>}
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default AddAddressComponent;
