/**
 * File: MoonUserDashboard
 * Description: The MoonUserDashboard component provides an interface for users to manage their Moon Wallet accounts.
 *              It allows users to view and select addresses associated with their account, make new addreses for their account,
 *              name them and rename them, and make transactions with them.
 *
 *  Props:
 *      -email: 
 *      -onDisconnect: 
 *      -token: 
 *      -moon: 
 *
 * Author: Team Kyle
 * Last Modified: 2/12/23
 */

/*****IMPORTS*****/
import React, { useState, useEffect } from 'react';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { getUserAddresses } from '@/services/getUserAddresses';
import AddAddressComponent from './AddAddressComponent'; 
import PaymentComponent from './PaymentComponent';
import { MoonSDK } from '@moonup/moon-sdk';

/*****PROPS INTERFACE*****/
interface MoonUserDashboardProps {
    email: string;
    onDisconnect: () => void;
    token: string;
    moon: MoonSDK;
}

/*****MAIN COMPONENT DEFINITION*****/
const MoonUserDashboard: React.FC<MoonUserDashboardProps> = ({ email, onDisconnect, moon }) => {
      // state hooks
    const [allAddresses, setAllAddresses] = useState<string[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [disconnecting, setDisconnecting] = useState<boolean>(false);
    const [isAddingAddress, setIsAddingAddress] = useState<boolean>(false);
    const [currentAddress, setCurrentAddress] = useState<string[] | null>(null);
    const [renameSuccessful, setRenameSuccessful] = useState<boolean | null>(null);

    // Destructures the disconnect function from the useMoonSDK hook.
    const {disconnect} = useMoonSDK();

    //load the addresses upon loading the page!
    useEffect(() => {
        loadAddresses();
    }, []);
    /***** updateUIAfterRename() *****/
    // handles the UI after an address has been successfully renamed
    const updateUIAfterRename = (success: boolean, newName?: string) => {
        setRenameSuccessful(success);
        
        if (success && newName && currentAddress) {
            setCurrentAddress([currentAddress[0], newName]);
    
            // Find the index of the address in allAddresses that matches the currentAddress
            const index = allAddresses.findIndex(([address, _]) => address === currentAddress[0]);
            
            if (index !== -1) {
                // Use a functional update to ensure React picks up the state change
                setAllAddresses(prevAddresses => {
                    // Create a new array with the same content as allAddresses
                    const updatedAddresses = [...prevAddresses];
                    // Update the name of the address at the found index
                    updatedAddresses[index] = [currentAddress[0], newName];
                    // Return the updated array to set the state
                    return updatedAddresses;
                });
            }
        }
    };
    
    /***** loadAddresses() *****/
    // loads addresses from Moon 
    const loadAddresses = async () => {
        setLoading(true);
        try {
            console.log(moon);
            const userAddresses = await getUserAddresses(email);
            // Update state with addresses
            setAllAddresses(userAddresses);
            setError(null);
        } catch (err) {
            setError('Failed to fetch addresses');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /******handleDisconnect()*****/
    // once the user has signed in, allow them to disconnect from Moon!
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

    /******handleAddressAdded()*****/
    // once an address has been successfully added, update state variables and refresh the addresses
    const handleAddressAdded = () => {
        setIsAddingAddress(false);
        loadAddresses();
    };

    /******handleExitPayment()*****/
    // when the back button is pressed in the payment component, set the current address being looked state variable to none which will exit the payment component!
    const handleExitPayment = () => {
        setCurrentAddress(null);
    };

    /******handleAddressSelection()*****/
    // when an address is selected, set the current address state variable to that address which should open the payment component
    const handleAddressSelection = (address: string, addressName: string) => {
        setCurrentAddress([address, addressName]);
    };

    /******toggleNewAccountCreation()*****/
    // function that toggles whether or not an account is being created 
    const toggleNewAccountCreation = () => {
        setIsAddingAddress(!isAddingAddress);
    };

    /*****sortedAddresses()*****/
    //function that sorts addresses alphabetically
    const sortedAddresses = [...allAddresses].sort(([addressA, nameA], [addressB, nameB]) => {
        // Fallback for null names
        nameA = nameA || 'Unnamed Address';
        nameB = nameB || 'Unnamed Address';
    
        // Separate the name into text and number parts
        const nameRegex = /(.*?)(\d*)$/;
        const [, textA, numberA] = nameA.match(nameRegex);
        const [, textB, numberB] = nameB.match(nameRegex);
    
        // First, compare the text part
        const textCompare = textA.localeCompare(textB);
        if (textCompare !== 0) return textCompare;
    
        // If text parts are identical, compare the numeric part
        const numA = numberA !== '' ? parseInt(numberA, 10) : 0;
        const numB = numberB !== '' ? parseInt(numberB, 10) : 0;
    
        return numA - numB;
    });

    // AT THE MOMENT DELETING ACCOUNTS IS NOT SUPPORTED BY MOONSDK
    // const handleAccountDeletion = async (account) => {
    //     deleteAccount(account);
    // };
    
    return (
        <div className="moon-cont extra-width">
            <p>Signed in with: {email}</p>

            {currentAddress ? (
                <PaymentComponent onRenameResult={updateUIAfterRename} email={email} moon={moon} address={currentAddress[0]} addressName={currentAddress[1]} onBack={handleExitPayment} />
            ) : loading ? (
                <p>Loading addresses...</p>
            ) : (
                <>
                    <h3>Choose an address to use:</h3>
                    {sortedAddresses.length > 0 ? (
                    sortedAddresses.map(([address, addressName], index) => (
                        <div key={index} style={{ margin: '5px 0' }}>
                            <button className="moon-btn4" style={{ display: 'block' }} onClick={() => handleAddressSelection(address, addressName)}>
                                <strong>{addressName || 'Unnamed Address'}</strong>: {address}
                            </button>
                        </div>
                    ))
                    ) : (
                        <p>No addresses made by this account!</p>
                    )}
                    {isAddingAddress && (
                        <div>
                            <AddAddressComponent onBack={toggleNewAccountCreation} onAddressAdded={handleAddressAdded} moon={moon} email={email}/>
                        </div>
                    )}
                    {!isAddingAddress && (
                        <button className='moon-btn4' type="button" onClick={toggleNewAccountCreation} style={{ marginRight: '10px' }}>Add an address!</button>
                    )}
                </>
            )}

            <div className="flex-row">
                <button
                    type="button"
                    className="moon-btn4"
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

export default MoonUserDashboard;