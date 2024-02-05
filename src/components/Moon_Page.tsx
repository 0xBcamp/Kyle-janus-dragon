import { useState } from 'react';
import { signInLogic } from '../hooks/signInLogic'; // Adjust the import path as necessary

const SignupPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(true); // New state to toggle between sign up and sign in
	const {
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
    addresses,
	  } = signInLogic(email, password, confirmPassword, setPasswordError);

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
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
      return (
        <div className="flex justify-center items-center h-screen">
            {!isConnected && (
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
                  {passwordError && (
                    <p className="text-red-500 text-xs italic">{passwordError}</p>
                  )}
                </div>
              )}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  className="bg-blue-500 text-white p-2 rounded mb-2"
                  onClick={isSigningUp ? handleSignup : handleSignIn}
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
                {error && <p className="text-red-500 mt-2">{error}</p>}
              </div>
            </form>
          )}
    
          {signupSuccess && !signInSuccess && isConnected && (
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
								onClick={handleSignIn}
							>
								{loading ? 'Signing in...' : 'Sign In'}
							</button>
							{error && <p className="text-red-500 ml-2">{error}</p>}
						</div>
					</form>
				</div>
          )}
    
		{signInSuccess && isConnected && (
			<div className="mt-4 text-center">
        <p>Signed in with: {email}</p>
				<h3>Your addresses:</h3>
        {
          chosenAddresses.length > 0 ? (
            chosenAddresses.map((address, index) => (
              <p key={index}>{address}</p> // Use the address itself or index as key
            ))
          ) : (
            <p>No addresses in use yet!</p>
          )
        }
        {
          chosenAddresses.length !== addresses.length && (
            <button type="button">Add an address here</button>
          )
        }

				<button
				type="button"
				className="bg-red-500 text-white p-2 rounded mt-2"
				onClick={handleDisconnect}
				>
				{loading ? 'Disconnecting...' : 'Disconnect from Moon'}
				</button>
				{error && <p className="text-red-500 mt-2">{error}</p>}
			</div>
			)}
        </div>
      );
    };
    
    export default SignupPage;