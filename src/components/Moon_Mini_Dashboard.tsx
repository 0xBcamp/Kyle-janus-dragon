import React, { useState, useEffect } from 'react';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { getChosenUserAddresses } from '@/hooks/getChosenUserAddresses';
import { getUnchosenUserAddresses } from '@/hooks/getUnchosenUserAddresses';
import AddAddressComponent from './Add_Address_Component'; // Assuming AddAddressComponent is in the same directory
import PaymentComponent from './Payment_Component';
import { MoonAccount } from '@moonup/types';

interface MoonMiniDashboardProps {
    email: string;
    onDisconnect: () => void;
    token: string;
    moon: MoonAccount;
}

const MoonMiniDashboard: React.FC<MoonMiniDashboardProps> = ({ email, onDisconnect, moon }) => {
    const [chosenAddresses, setChosenAddresses] = useState<string[][]>([]);
    const [unchosenAddresses, setUnchosenAddresses] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [disconnecting, setDisconnecting] = useState<boolean>(false);
    const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
    const [currentAddress, setCurrentAddress] = useState<string[] | null>(null);

    const { disconnect, deleteAccount } = useMoonSDK();

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
    }, []);

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

    const handleAddressAdded = () => {
        setIsAddingAddress(false);
        loadAddresses();
    };

    const handleBack = () => {
        setIsAddingAddress(false);
        setCurrentAddress(null);
    };

    const handleAddressSelection = (address: string, addressName: string) => {
        setCurrentAddress([address, addressName]);
    };

    const handleAccountDeletion = async (account) => {
        deleteAccount(account);
    };

    const toggleNewAccountCreation = () => {
        setIsAddingAddress(!isAddingAddress);
        console.log(isAddingAddress);
    };

    return (
        <div className="mt-4 text-center">
            <p>Signed in with: {email}</p>

            {currentAddress ? (
                <PaymentComponent address={currentAddress[0]} addressName={currentAddress[1]} onBack={handleBack} />
            ) : loading ? (
                <p>Loading addresses...</p>
            ) : (
                <>
                    <h3>Choose an address to pay with:</h3>
                    {chosenAddresses.length > 0 ? (
                        chosenAddresses.map(([address, addressName], index) => (
                            <div key={index} style={{ margin: '5px 0' }}>
                                <button className="marked" style={{ display: 'block' }} onClick={() => handleAddressSelection(address, addressName)}>
                                    <strong>{addressName}</strong>: {address}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No addresses in use yet!</p>
                    )}
                </>
            )}

            <div className="flex-row">
                {isAddingAddress && (
                    <div>
                        <AddAddressComponent onBack={toggleNewAccountCreation} userAddresses={unchosenAddresses} onAddressAdded={handleAddressAdded} moon={moon}/>
                    </div>
                )}
                {!isAddingAddress && (
                    <button type="button" onClick={toggleNewAccountCreation} style={{ marginRight: '10px' }}>Add an address!</button>
                )}
                <button
                    type="button"
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={handleDisconnect}
                    style={{ marginRight: '10px' }}
                >
                    {disconnecting ? 'Disconnecting...' : 'Disconnect from Moon'}
                </button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default MoonMiniDashboard;
