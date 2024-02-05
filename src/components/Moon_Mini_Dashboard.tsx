import React, { useState, useEffect } from 'react';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { getChosenUserAddresses } from '@/hooks/getChosenUserAddresses';
import { getUnchosenUserAddresses } from '@/hooks/getUnchosenUserAddresses';
import AddAddressComponent from './Add_Address_Component';// Assuming AddAddressComponent is in the same directory

interface MoonMiniDashboardProps {
    email: string;
    onDisconnect: () => void;
}

const MoonMiniDashboard: React.FC<MoonMiniDashboardProps> = ({ email, onDisconnect }) => {
    const [chosenAddresses, setChosenAddresses] = useState<string[][]>([]);
    const [unchosenAddresses, setUnchosenAddresses] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [disconnecting, setDisconnecting] = useState<boolean>(false);
    const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);

    const { disconnect } = useMoonSDK();

    const loadAddresses = async () => {
        setLoading(true);
        try {
            const unchosenAddresses = await getUnchosenUserAddresses(email);
            setUnchosenAddresses(unchosenAddresses);
            const chosenAddresses = await getChosenUserAddresses(email);
            setChosenAddresses(chosenAddresses);
            setError(null);
        } catch (err) {
            setError('Failed to fetch addresses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAddresses();
    }, [email]);
    
    const handleDisconnect = async () => {
      setDisconnecting(true);
      try {
          await disconnect();
          console.log('Disconnected');
          onDisconnect();
      } catch (error) {
          console.error('Error during disconnection:', error);
          setError('Error disconnecting from Moon. Please try again.');
      } finally {
          setDisconnecting(false);
      }
    };

    const handleAddAddressClick = () => {
        setIsAddingAddress(true);
    };

    const handleAddressAdded = () => {
        setIsAddingAddress(false);
        // Reload addresses or perform any other necessary updates
    };

    const handleBack = () => {
        setIsAddingAddress(false);
      };
      

    return (
        <div className="mt-4 text-center">
            <p>Signed in with: {email}</p>
            {isAddingAddress ? (
               <AddAddressComponent
               userAddresses={unchosenAddresses}
               onAddressAdded={() => {
                 setIsAddingAddress(false); // Optionally reset isAddingAddress when an address is successfully added
                 loadAddresses();
               }}
               onBack={handleBack}
             />
            ) : (
                <>
                    <h3>Your addresses:</h3>
                    {chosenAddresses.length > 0 ? (
                        chosenAddresses.map((address, index) => (
                            <p key={index}>{address}</p>
                        ))
                    ) : (
                        <p>No addresses in use yet!</p>
                    )}
                    {unchosenAddresses.length != 0 && (
                        <button type="button" onClick={handleAddAddressClick}>Add an address here</button>
                    )}
                    <button
                        type="button"
                        className="bg-red-500 text-white p-2 rounded mt-2"
                        onClick={handleDisconnect}
                    >
                        {disconnecting ? 'Disconnecting...' : 'Disconnect from Moon'}
                    </button>
                </>
            )}

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default MoonMiniDashboard;
