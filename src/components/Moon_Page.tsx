import React, { useState } from 'react';
import SignupPage from './Moon_SignIn_Page';
import MoonMiniDashboard from './Moon_Mini_Dashboard';

const MoonPage: React.FC = () => {
    // Initialize states to manage connection and sign-in status
    const [isConnected, setIsConnected] = useState(false);
    const [signInSuccess, setSignInSuccess] = useState(false);
    const [email, setEmail] = useState<string>(''); // Add email state

    // Function to handle user disconnection
    const handleDisconnectFromParent = () => {
        setIsConnected(false);
        setSignInSuccess(false); // Also reset signInSuccess when disconnecting
    };

    return (
        <div>
            {signInSuccess && isConnected ? (
                <MoonMiniDashboard email={email} onDisconnect={handleDisconnectFromParent}/>
            ) : (
            <SignupPage 
                setIsConnected={setIsConnected} 
                setSignInSuccess={setSignInSuccess}
                setEmail={setEmail} // Pass setEmail to SignupPage
            />
            )}
        </div>
    );
};

export default MoonPage;
