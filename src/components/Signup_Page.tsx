import {
	EmailLoginInput,
	EmailSignupInput,
	Accounts
} from '@moonup/moon-api';
import { useState } from 'react';
import {useMoonSDK} from '../hooks/useMoonSDK'
import { addUser } from '@/hooks/addUser';
import { findEntriesByEmail } from '@/hooks/getMoonAddresses';

const SignupPage: React.FC = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [signupSuccess, setSignupSuccess] = useState(false);
	const [signInSuccess, setSignInSuccess] = useState(false);
	const [addresses, setAddresses] = useState(['']);
	const [isConnected, setIsConnected] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
    const [isSigningUp, setIsSigningUp] = useState(true); // New state to toggle between sign up and sign in

	const { moon, connect, createAccount, disconnect, updateToken, initialize, getUserAddresses } =
		useMoonSDK();

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
			const {token, refreshToken} = loginResponse.data;
			console.log('Authentication successful:', loginResponse);

			// Set tokens and email
			console.log('Updating tokens and email for browser session...');
			await updateToken(
				loginResponse.data.token,
				loginResponse.data.refreshToken
			);
			moon.MoonAccount.setEmail(email);
			moon.MoonAccount.setExpiry(loginResponse.data.expiry);
			const userAddresses = await getUserAddresses()
			setAddresses(userAddresses)
			addUser(email)

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
				<button></button>
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