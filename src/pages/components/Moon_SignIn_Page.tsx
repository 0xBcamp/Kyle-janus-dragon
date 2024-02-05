import React, { Dispatch, SetStateAction, useState } from 'react';
import { useSignInLogic } from '../hooks/useSignInLogic'; // Adjust the import path as necessary

// Define an interface for the component's props
interface SignupPageProps {
    setIsConnected: (isConnected: boolean) => void;
    setSignInSuccess: (signInSuccess: boolean) => void;
    setEmail: (email:string) => void;
}

const SignUpPage: React.FC<SignupPageProps> = ({ setIsConnected, setSignInSuccess, setEmail})=> {
  const [emailInput, setEmailInput] = useState(''); // Define emailInput state

  const {
    handleSignUp,
    handleSignIn,
    handleInitializeAndConnect,
    isConnected: hookIsConnected, // Use this for conditional checks
    signupSuccess,
    signInSuccess,
    loading,
    error,
    setPassword,
    setConfirmPassword,
    setIsSigningUp,
    isSigningUp,
    password,
    email,
    confirmPassword,
    passwordError
  } = useSignInLogic();


  React.useEffect(() => {
    setIsConnected(hookIsConnected);
    setSignInSuccess(signInSuccess);
  }, [hookIsConnected, signInSuccess, setIsConnected, setSignInSuccess]);

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
    setEmail(emailInput);
  };
  
  const onSignUpClick = async () => {
    await handleSignUp(emailInput, password, confirmPassword);
  };
    return (
      <div className="flex justify-center items-center h-screen">
          {!hookIsConnected && (
              <div>
                  <h2 className="text-2xl font-bold mb-4 text-center">Initialize & Connect to Moon</h2>
                  <button
                      type="button"
                      className="bg-blue-500 text-white p-2 rounded"
                      onClick={handleInitializeAndConnect}
                  >
                      {loading ? 'Connecting...' : 'Initialize & Connect to Moon'}
                  </button>
                  {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
          )}
  
        {hookIsConnected && !signupSuccess && !signInSuccess && (
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
  
        {signupSuccess && !signInSuccess && hookIsConnected &&  (
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
              value={email}
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