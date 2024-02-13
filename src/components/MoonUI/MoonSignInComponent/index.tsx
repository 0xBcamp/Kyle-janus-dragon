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
import React, { Dispatch, SetStateAction, useState, useCallback } from "react";
import { MoonSDK } from "@moonup/moon-sdk";
import { useMoonSDK } from "@/hooks/useMoonSDK";
import { addUser } from "@/services/addUser";
import { getUserAddressesFromMoon, createAccount } from "@/utils/moonSDKUtils";
import {
  checkPasswordsMatch,
  signUpUser,
  signInUser,
} from "@/utils/signInUtils";
import ConnectToMoonSection from "./ConnectToMoonSection";
import AuthForm from "./AuthForm";

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
  signInSuccess,
}) => {
  //component state declarations
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Tracks password mismatch errors
  const [signUpSuccess, setSignUpSuccess] = useState(false); // Indicates if the signup was successful
  const [loading, setLoading] = useState(false); // Indicates loading state
  const [error, setError] = useState<string | null>(null); // Stores error messages
  const { moon, connect, disconnect, updateToken, initialize } = useMoonSDK(); // MoonSDK hook for wallet interaction
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
      setError("Error connecting to Moon. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [moon, setIsConnected, initialize]);

  /***** handleSignUp() *****/
  const handleSignUp = useCallback(
    async (email: string, password: string, confirmPassword: string) => {
      setLoading(true);
      setError(null);

      //check if password and confirm password are indeed the same
      const [passwordsMatch, passwordError] = checkPasswordsMatch(
        password,
        confirmPassword
      );
      if (!passwordsMatch) {
        setPasswordError(passwordError);
        setLoading(false);
        return;
      }

      if (!moon) {
        setError("Moon SDK was not initialized.");
        setLoading(false);
        return;
      }

      //create a moon wallet using  using email and password!
      try {
        signUpUser(moon, email, password);
        setSignUpSuccess(true);
        setIsSigningUp(false);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "An unknown error occurred";
        setError("Error signing up. Please try again.");
      } finally {
        setEmailInput("");
        setEmail("");
        setLoading(false);
      }
    },
    [moon]
  );

  /***** handleSignIn() *****/
  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      if (!moon) {
        setError("Moon SDK was not initialized.");
        setLoading(false);
        return;
      }

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
        setEmail(emailInput);
      } catch (signInError) {
        setError(`${signInError.error.message}`);
      } finally {
        setLoading(false);
      }
    },
    [moon, updateToken, setSignInSuccess]
  );

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
    setPasswordError("");
    setSignUpSuccess(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      {/** Part to connect to Moon **/}
      {!isConnected && (
        <ConnectToMoonSection
          onConnect={handleInitializeAndConnect}
          loading={loading}
          error={error}
        />
      )}

      {/** Part that signs in or signs up once connected to Moon **/}
      {isConnected && !signInSuccess && (
        <AuthForm
          isSigningUp={isSigningUp}
          emailInput={emailInput}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onConfirmPasswordChange={handleConfirmPasswordChange}
          password={password}
          confirmPassword={confirmPassword}
          onSignInClick={handleSignIn} //triggered when user signs in with AuthForm
          onSignUpClick={handleSignUp} //triggered when user signs up in AuthForm
          onToggleSignInUp={toggleSignInUp}
          loading={loading}
          error={error}
          passwordError={passwordError}
          signUpSuccess={signUpSuccess}
        />
      )}
    </div>
  );
};

export default MoonSignInComponent;
