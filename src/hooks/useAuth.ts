// Import necessary dependencies
import { useState } from 'react';
import { useMoonSDK } from '../hooks/useMoonSDK'; // Adjust the import path as necessary
import {
	EmailLoginInput,
	EmailSignupInput,
	Accounts
} from '@moonup/moon-api';
import { addUser } from '@/hooks/addUser';
import { findEntriesByEmail } from '@/hooks/findEntriesByEmail';
export const useAuth = (email: string, password: string, confirmPassword: string, setPasswordError: (error: string) => void) => {
  // Hook state management for authentication
  const [isConnected, setIsConnected] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [chosenAddresses, setChosenAddresses] = useState<string[][]>([]); // Corrected to an array of arrays

  // Additional state variables as needed

    const { moon, connect, createAccount, disconnect, updateToken, initialize, getUserAddresses } = useMoonSDK();

    // Logic for handling signup, signin, initializing, and disconnecting
    const handleInitializeAndConnect = async () => {
        try {
            setLoading(true);
            setError(null);

            // Initialize and connect to Moon
            console.log('Initializing and connecting to Moon...');
            await initialize();
            await connect();
            console.log('Connected to Moon!');
            setIsConnected(true);
        } catch (error) {
            console.error('Error during connection:', error);
            setError('Error connecting to Moon. Please try again.');
        } finally {
            setLoading(false);
        }
    };
	const handleSignup = async () => {
		try {
			setLoading(true);
			setError(null);

			if (password !== confirmPassword) {
				setPasswordError('Passwords do not match');
			} else {
				setPasswordError('');

				// Sign up the user
				const auth = moon.getAuthSDK();
				const signupRequest: EmailSignupInput = {
					email,
					password,
				};
				console.log('Signing up...');
				const signupResponse: any = await auth.emailSignup(signupRequest);
				const {token, refreshToken} = signupResponse.data;
				console.log('Signup successful:', signupResponse);

				setSignupSuccess(true);
			}
		} catch (error) {
			console.error('Error during signup:', error);
			setError('Error signing up. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	const handleSignIn = async () => {
		try {
			setLoading(true);
			setError(null);
	
			// Authenticate the user and sign in
			const auth = moon.getAuthSDK();
			const loginRequest: EmailLoginInput = {
				email,
				password,
			};
			
			console.log('Authenticating...');
			const loginResponse: any = await auth.emailLogin(loginRequest);
			console.log('Authentication successful:', loginResponse);
	
			// Set tokens and email for browser session
			console.log('Updating tokens and email...');
			await updateToken(
				loginResponse.data.token,
				loginResponse.data.refreshToken
			);
			moon.MoonAccount.setEmail(email);
			moon.MoonAccount.setExpiry(loginResponse.data.expiry);
	
			// Retrieve and use user addresses
			const userAddresses = await getUserAddresses();
			setAddresses(userAddresses); // Update state with the new addresses
			console.log(userAddresses); // userAddresses contains the updated data
	
			// Use userAddresses directly here since it's the updated data
			addUser(email, userAddresses); // Adjusted to use userAddresses directly
			setChosenAddresses(await findEntriesByEmail(email))
			setSignInSuccess(true);
		} catch (error) {
			console.error('Error during sign-in:', error);
			setError('Error signing in. Please try again.');
		} finally {
			setLoading(false);
		}
	};
	


	const handleDisconnect = async () => {
		try {
			setLoading(true);
			setError(null);
			// Disconnect from Moon
			console.log('Disconnecting...');
			await disconnect();
			console.log('Disconnected');
			setIsConnected(false);
		} catch (error) {
			console.error('Error during disconnection:', error);
			setError('Error disconnecting from Moon. Please try again.');
		} finally {
			setLoading(false);
		}
	};


  // Return state and functions that the UI component can use
  return {
    handleSignup,
    handleSignIn,
    handleInitializeAndConnect,
    handleDisconnect,
    isConnected,
    signupSuccess,
    signInSuccess,
    loading,
    error,
    chosenAddresses,
    // Add other relevant states and functions
  };
};
