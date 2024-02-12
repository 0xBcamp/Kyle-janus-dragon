import React, { Dispatch, SetStateAction, useState, useCallback } from 'react';
import { useSignInLogic } from '../hooks/useSignInLogic'; // Adjust the import path as necessary
import { MoonSDK } from '@moonup/moon-sdk';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import {
	EmailLoginInput,
	EmailSignupInput,
} from '@moonup/moon-api';
import { addUser } from '@/services/addUser';
import { getUserAddressesFromMoon, createAccount } from '@/utils/moonSDKUtils';


// Define an interface for the component's props
interface SignupPageProps {
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  setSignInSuccess: Dispatch<SetStateAction<boolean>>;
  setEmail: Dispatch<SetStateAction<string>>;
  onTokenReceived: (token: string | null) => void;
  onMoonInstanceReceived: (moonInstance: MoonSDK) => void;
  isConnected: boolean; // Add this line
  signInSuccess: boolean; // And this line
}



const SignUpPage: React.FC<SignupPageProps> = ({ setIsConnected, setSignInSuccess, setEmail, onMoonInstanceReceived, onTokenReceived, isConnected, signInSuccess})=> {
  const [emailInput, setEmailInput] = useState(''); // Define emailInput state
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [signupSuccess, setSignupSuccess] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
  const { moon, connect, disconnect, updateToken, initialize} = useMoonSDK();

  const [isSigningUp, setIsSigningUp] = useState(true);

  
  React.useEffect(() => {
    setIsConnected(isConnected);
    setSignInSuccess(signInSuccess);
  }, [isConnected, signInSuccess, setIsConnected, setSignInSuccess]);

  const handleInitializeAndConnect = useCallback(async () => {

    setLoading(true);
    setError(null);
    try {
      await initialize();
      await moon?.connect();
      console.log(moon);
      setIsConnected(true);
    } catch (error) {
      setError('Error connecting to Moon. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [connect, initialize]);

  const handleSignUp = useCallback(async (email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      setLoading(false);
      return;
    }
    else{
      setPasswordError('None');
    }
    try {
      const auth = moon.getAuthSDK();
      const signupRequest: EmailSignupInput = { email, password };
      const signupResponse: any = await auth.emailSignup(signupRequest);
      const newAccount = createAccount(moon);
      setSignupSuccess(true);
    } catch (error) {
      setError('Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [moon]);

  const handleSignIn = useCallback(async (email, password) => {
    console.log("moon", moon);
    setLoading(true);
    setError(null);
    try {
      const auth = moon.getAuthSDK();
      const loginRequest: EmailLoginInput = { email, password };
      const loginResponse: any = await auth.emailLogin(loginRequest);
      await updateToken(loginResponse.data.token, loginResponse.data.refreshToken);
      const userAddresses = await getUserAddressesFromMoon(moon);
      console.log('getting addies');
      console.log(userAddresses);
      await addUser(email, userAddresses)
      setSignInSuccess(true);

    } catch (error) {
      setError(`Error signing in: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);    
    } finally {
      setLoading(false);
    }
  }, [moon, updateToken, getUserAddressesFromMoon]);

  const handleDisconnect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await disconnect();
      setIsConnected(false);
    } catch (error) {
      setError('Error disconnecting from Moon. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [disconnect]);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value); // Update local emailInput state
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); // Update password in the hook
  };

	const handleConfirmPasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(event.target.value);
	};
	// Toggle between sign up and sign in
	const toggleSignInUp = () => {
		setIsSigningUp(!isSigningUp);
	};
  const onSignInClick = async () => {
    await handleSignIn(emailInput, password);
    if (moon) {
      onMoonInstanceReceived(moon);
    }
    setEmail(emailInput);
  };
  
  const onSignUpClick = async () => {
    await handleSignUp(emailInput, password, confirmPassword);
  };
  const handleInitializeAndConnectWithToken = async () => {
    const token = await handleInitializeAndConnect();
    console.log(moon);
  };
    return (
      <div className="flex justify-center items-center h-screen">
          {!isConnected && (
              <div>
                  <h2 className="text-2xl font-bold mb-4 text-center">Initialize & Connect to Moon</h2>
                  <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded"
                      onClick={handleInitializeAndConnectWithToken}
                  >
                      {loading ? 'Connecting...' : 'Initialize & Connect to Moon'}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
          )}
  
        {isConnected && !signupSuccess && !signInSuccess && (
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold mb-4">
                {isSigningUp ? 'Sign up for a Moon Account' : 'Sign In'}
              </h2>
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded mb-2"
                value={emailInput}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded mb-2"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {isSigningUp && (
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full border p-2 rounded mb-2 ${
                    passwordError ? 'border-red-500' : ''
                  }`}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
              </div>
            )}
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded mb-2"
                onClick={isSigningUp ? onSignUpClick : onSignInClick}
              >
                {loading ? (isSigningUp ? 'Signing up...' : 'Signing in...') : (isSigningUp ? 'Sign up for a Moon Account' : 'Sign In')}
              </button>
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={toggleSignInUp}
              >
                {isSigningUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
              {passwordError != 'None' ? (
                <p className="text-red-500 text-xs italic">{passwordError}</p>
              ) : error ? (
                <p className="text-red-500 mt-2">{error}</p>
              ) : null}
            </div>
          </form>
        )}
  
        {signupSuccess && !signInSuccess && isConnected &&  (
          <div className="mb-4 text-center">
        <p>Congratulations! Your Moon account is created.</p>
        <p>Now that you have created an account, sign in.</p>
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded mb-2"
              onChange={handleEmailChange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full border p-2 rounded mb-2"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="bg-blue-500 text-white p-2 rounded"
              onClick={onSignInClick}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {error && <p className="text-red-500 ml-2">{error}</p>}
          </div>
        </form>
      </div>
        )}
      </div>
    );
  };
  
  export default SignUpPage;