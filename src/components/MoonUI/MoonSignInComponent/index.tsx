/**
 * Component: MoonSignInComponent
 * Description: Provides a UI for users to sign in or sign up to their Moon wallet within the MoonUI.
 *              It handles user authentication, including email/password input, and establishes
 *              a connection to the MoonSDK for further wallet interactions.
 * 
 * Props:
 *  - setIsConnected: Updates the state indicating whether the user is connected which toggles if this component is shown or the dashboard is shown.
 *  - setSignInSuccess: Updates the state indicating whether the user has successfully signed in.
 *  - setEmail: Sets the user's email in the parent component's state.
 *  - onMoonInstanceReceived: Callback function for receiving the MoonSDK instance.
 *  - isConnected: Boolean state indicating current connection status.
 *  - signInSuccess: Boolean state indicating if the user has successfully signed in.
 *
 * Author: Team Kyle
 * Last Modified: 2/12/23
 */

/*****IMPORTS*****/
import React, { Dispatch, SetStateAction, useState, useCallback } from 'react';
import { MoonSDK } from '@moonup/moon-sdk';
import { useMoonSDK } from '@/hooks/useMoonSDK';
import { addUser } from '@/services/addUser';
import { getUserAddressesFromMoon, createAccount } from '@/utils/moonSDKUtils';
import { checkPasswordsMatch, signUpUser, signInUser } from '@/utils/signInUtils';
import ConnectToMoonSection from './ConnectToMoonSection';

/*****PROPS INTERFACE*****/
interface SignupComponentProps {
  setIsConnected: Dispatch<SetStateAction<boolean>>;
  setSignInSuccess: Dispatch<SetStateAction<boolean>>;
  setEmail: Dispatch<SetStateAction<string>>;
  onMoonInstanceReceived: (moonInstance: MoonSDK) => void;
  isConnected: boolean;
  signInSuccess: boolean; 
}

/*****MAIN COMPONENT DEFINITION*****/
const MoonSignInComponent: React.FC<SignupComponentProps> = ({ 
  setIsConnected, 
  setSignInSuccess, 
  setEmail, 
  onMoonInstanceReceived, 
  isConnected, 
  signInSuccess})=> {
    //component state declarations
    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(''); // Tracks password mismatch errors
    const [signupSuccess, setSignupSuccess] = useState(false); // Indicates if the signup was successful
    const [loading, setLoading] = useState(false); // Indicates loading state
    const [error, setError] = useState<string | null>(null); // Stores error messages
    const { moon, connect, disconnect, updateToken, initialize} = useMoonSDK(); // MoonSDK hook for wallet interaction
    const [isSigningUp, setIsSigningUp] = useState(true); // Toggles between sign-up and sign-in mode

    // Sync the component state with props to reflect the current connection and sign-in status.
    React.useEffect(() => {
      setIsConnected(isConnected);
      setSignInSuccess(signInSuccess);
    }, [isConnected, signInSuccess, setIsConnected, setSignInSuccess]);
  
  /***** handleInitializeAndConnect() *****/
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
  }, [moon, setIsConnected, initialize]);

  /***** handleSignUp() *****/
  const handleSignUp = useCallback(async (email: string, password:string, confirmPassword:string) => {
    setLoading(true);
    setError(null);

    //check if password and confirm password are indeed the same
    const [passwordsMatch, passwordError] = checkPasswordsMatch(password, confirmPassword);
    if (!passwordsMatch) {
      setPasswordError(passwordError);
      setLoading(false);
      return;
    }

    if (!moon) { 
      setError('Moon SDK was not initialized.');
      setLoading(false);
      return;
    };

    //create a moon wallet using  using email and password!
    try {
      signUpUser(moon, email,password);
      setSignupSuccess(true);
    } catch (error) {
      setError('Error signing up. Please try again.');
    } finally {
      setEmailInput('');
      setEmail('');
      setLoading(false);
    }
  }, [moon]);

  /***** handleSignIn() *****/
  const handleSignIn = useCallback(async (email: string, password:string ) => {
    setLoading(true);
    setError(null);
    
    if (!moon) { 
      setError('Moon SDK was not initialized.');
      setLoading(false);
      return;
    };

    //sign into Moon Wallet using email and password!
    try {
      const [token, refreshToken] = await signInUser(moon, email, password);
      await updateToken(token, refreshToken);
      const userAddresses = await getUserAddressesFromMoon(moon);
      console.log("Moon Wallet user's addresses:");
      console.log(userAddresses);

      //addUser() handles logic of storing user and their addresses in the database if needed
      await addUser(email, userAddresses);
      setSignInSuccess(true);
    } catch (signInError) {
      setError(`${signInError.error.message}`);
    } finally {
      setLoading(false);
    }
  }, [moon, updateToken, setSignInSuccess]);

  /***** Sign-In Input Handlers *****/
  //handles text input for inputting email
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
  };

  //handles text input for inputting password
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value); 
  };

  //handles text input for inputting confirm password
	const handleConfirmPasswordChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(event.target.value);
	};

  /***** toggleSignInUp *****/
  //toggles between signing in and signing up
	const toggleSignInUp = () => {
		setIsSigningUp(!isSigningUp);
    setPasswordError('');
    setSignupSuccess(false);
	};

  /***** onSignInClick *****/
  // handles logic for signing in from "Sign In" button
  const onSignInClick = async () => {
    await handleSignIn(emailInput, password);
    if (moon) {
      onMoonInstanceReceived(moon);
    }
    setEmail(emailInput);
  };

  /***** onSignUpClick *****/
  // handles logic for signing up from "Sign Up For Moon Account" button
  const onSignUpClick = async () => {
    await handleSignUp(emailInput, password, confirmPassword);
  };

    return (
      <div className="flex justify-center items-center h-screen">
        {/** Part to connect to Moon **/}
          {!isConnected && (
            <ConnectToMoonSection onConnect={handleInitializeAndConnect} loading={loading} error={error}/>
          )}

        {/** Part that signs in or signs up once connected to Moon **/}
        {isConnected && !signupSuccess && !signInSuccess && (
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold mb-4">
                {isSigningUp ? 'Sign up for a Moon Account' : 'Sign In'}
              </h2>
              {/** email input **/}
              <input
                type="email"
                placeholder="Email"
                className="w-full border p-2 rounded mb-2"
                value={emailInput}
                onChange={handleEmailChange}
              />
            </div>
            <div className="mb-4">
              {/** password input **/}
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded mb-2"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {/** confirm password input **/}
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
            {/** Sign-in Sign-up button **/}
            <div className="flex flex-col items-center">
              <button
                type="button"
                className="bg-blue-500 text-white p-2 rounded mb-2"
                onClick={isSigningUp ? onSignUpClick : onSignInClick}
              >
                {loading ? (isSigningUp ? 'Signing up...' : 'Signing in...') : (isSigningUp ? 'Sign up for a Moon Account' : 'Sign In')}
              </button>
              {/** Switch between signing in and signing up button **/}
              <button
                type="button"
                className="text-blue-500 underline"
                onClick={toggleSignInUp}
              >
                {isSigningUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
               {/** Error message **/}
              {!isSigningUp ? error && <p className="text-red-500 ml-2">{error}</p> : passwordError && <p className="text-red-500 ml-2">{passwordError}</p>}

            </div>
          </form>
        )}
         {/** After you've signed up, there is this login page **/}
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
            <button
                type="button"
                className="text-blue-500 underline"
                onClick={toggleSignInUp}
              >
                {isSigningUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            {error && <p className="text-red-500 ml-2">{error}</p>}
          </div>
        </form>
      </div>
        )}
      </div>
    );
  };
  
  export default MoonSignInComponent;