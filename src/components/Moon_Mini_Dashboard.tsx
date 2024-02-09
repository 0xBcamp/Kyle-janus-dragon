import React, { useState, useEffect } from 'react';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { getChosenUserAddresses } from '@/hooks/getChosenUserAddresses';
import { getUnchosenUserAddresses } from '@/hooks/getUnchosenUserAddresses';
import AddAddressComponent from './Add_Address_Component'; // Assuming AddAddressComponent is in the same directory
import PaymentComponent from './Payment_Component';

interface MoonMiniDashboardProps {
    email: string;
    onDisconnect: () => void;
    token: string;
}

const MoonMiniDashboard: React.FC<MoonMiniDashboardProps> = ({ email, onDisconnect, token }) => {
    const [chosenAddresses, setChosenAddresses] = useState<string[][]>([]);
    const [unchosenAddresses, setUnchosenAddresses] = useState<string[]>([]);
    // Start with loading set to true to indicate that data is being fetched
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [disconnecting, setDisconnecting] = useState<boolean>(false);
    const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
    const [currentAddress, setCurrentAddress] = useState<string[] | null>(null);

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
        loadAddresses();
    };

    const handleBack = () => {
        setIsAddingAddress(false);
        setCurrentAddress(null);
    };

    const handleAddressSelection = (address: string, addressName: string) => {
        setCurrentAddress([address, addressName]);
    };

    return (
        <div className="mt-4 text-center">
            <p>Signed in with: {email}</p>
            
            {isAddingAddress ? (
                <AddAddressComponent
                    userAddresses={unchosenAddresses}
                    onAddressAdded={handleAddressAdded}
                    onBack={handleBack}
                />
            ) : currentAddress ? (
                <PaymentComponent address={currentAddress[0]} addressName={currentAddress[1]} onBack={handleBack} />
            ) : loading ? (
                <p>Loading addresses...</p> // Display loading message while fetching data
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

                    {unchosenAddresses.length !== 0 && (
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
