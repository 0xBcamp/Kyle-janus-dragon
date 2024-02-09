// MoonPage
import React, { useState } from 'react';
import SignUpPage from './Moon_SignIn_Page';
import MoonMiniDashboard from './Moon_Mini_Dashboard';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { MoonSDK } from '@moonup/moon-sdk'; // Ensure this import is correct

const MoonPage: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(false);
    const [email, setEmail] = useState<string>('');
    const [token, setToken] = useState<string | undefined>();
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

    const handleTokenReceived = (token) => {
        setToken(token);
      };

    return (
        <div className='absolute inset-x-0 bottom-0 mx-auto mb-4 cursor-pointer'>
            {signInSuccess && isConnected ? (
                <MoonMiniDashboard email={email} onDisconnect={handleDisconnectFromParent} moon={moon}/>
            ) : (
                <SignUpPage
                    setIsConnected={setIsConnected}
                    setSignInSuccess={setSignInSuccess}
                    setEmail={setEmail}
                    onTokenReceived={handleTokenReceived} // Define this function as needed
                    onMoonInstanceReceived={handleMoonInstanceReceived} // Define this function as needed
                    isConnected={isConnected}
                    signInSuccess={signInSuccess}
              />
            )}
        </div>
    );
};

export default MoonPage;
