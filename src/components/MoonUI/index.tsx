/**
 * File: index.tsx
 * Description: A component that is shown on the homepage that handles signing into Moon and interacting with your Moon account!
 * 
 * Author: Team Kyle
 * Last Modified: 2/12/23
 */
import React, { useState } from 'react';
import MoonSignInComponent from './MoonSignInComponent';
import MoonUserDashboard from './MoonUserDashboard';
import { MoonSDK } from '@moonup/moon-sdk'; // Ensure this import is correct

const MoonUI: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [moon, setMoon] = useState<MoonSDK | null>(null);

    // Add this callback function
    const handleMoonInstanceReceived = (moonInstance: MoonSDK) => {
        setMoon(moonInstance);
    };

    // Function to handle user disconnection
    const handleDisconnectFromParent = () => {
        setIsConnected(false);
        setSignInSuccess(false); // Also reset signInSuccess when disconnecting
    };


    return (
        <div className='extra-width'>
            {signInSuccess && isConnected ? (
                <MoonUserDashboard email={email} onDisconnect={handleDisconnectFromParent} moon={moon}/>
            ) : (
                <MoonSignInComponent
                    setIsConnected={setIsConnected}
                    setSignInSuccess={setSignInSuccess}
                    setEmail={setEmail}
                    onMoonInstanceReceived={handleMoonInstanceReceived} // Define this function as needed
                    isConnected={isConnected}
                    signInSuccess={signInSuccess}
              />
            )}
        </div>
    );
};

export default MoonUI;
