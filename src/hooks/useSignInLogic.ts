import { useState, useCallback } from 'react';
import { useMoonSDK } from './useMoonSDK'; // Adjust the import path as necessary
import { EmailLoginInput, EmailSignupInput } from '@moonup/moon-api';
import { addUser } from '@/hooks/hook_functions/addUser';

// Renamed from signInLogic to useSignInLogic
export const useSignInLogic = () => {
  const [email, setEmail] = useState(''); // Manage email state within the hook
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [isSigningUp, setIsSigningUp] = useState(true);
  const { moon, connect, createAccount, disconnect, updateToken, initialize, getUserAddresses } = useMoonSDK();

  const handleInitializeAndConnect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await initialize();
      await connect();
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
      setSignupSuccess(true);
    } catch (error) {
      setError('Error signing up. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [moon]);

  const handleSignIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const auth = moon.getAuthSDK();
      const loginRequest: EmailLoginInput = { email, password };
      const loginResponse: any = await auth.emailLogin(loginRequest);
      await updateToken(loginResponse.data.token, loginResponse.data.refreshToken);
      const userAddresses = await getUserAddresses();
      console.log(userAddresses);
      await setAddresses(userAddresses);
      await addUser(email, userAddresses)
      setSignInSuccess(true);
    } catch (error) {
      setError(`Error signing in: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(error);    
    } finally {
      setLoading(false);
    }
  }, [moon, updateToken, getUserAddresses]);

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

  return {
    setEmail,
    setPassword,
    setConfirmPassword,
    setPasswordError,
    handleSignUp,
    handleSignIn,
    handleInitializeAndConnect,
    handleDisconnect,
    isConnected,
    setIsConnected,
    signupSuccess,
    signInSuccess,
    loading,
    error,
    addresses,
    setIsSigningUp,
    isSigningUp,
    password,
    confirmPassword,
    email,
    passwordError,
  };
};
