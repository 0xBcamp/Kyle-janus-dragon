/**
 * Component: AuthForm
 *
 * Usage: This component renders the signin/signup page for users. Users can sign up for a Moon Wallet and then sign in, or sign in with an existing account!
 * Depending on the mode (sign-up or sign-in), it dynamically updates its UI to reflect
 * the appropriate fields and actions.
 *
 * Props:
 *  - isSigningUp: Boolean indicating if the form should operate in sign-up mode.
 *  - emailInput: String holding the current input for the email field.
 *  - onEmailChange: Function to execute when the email input changes.
 *  - password: String holding the current input for the password field.
 *  - onPasswordChange: Function to execute when the password input changes.
 *  - confirmPassword: String holding the current input for the confirm password field, relevant in sign-up mode.
 *  - onConfirmPasswordChange: Function to execute when the confirm password input changes.
 *  - onSignUpClick: Function to execute when the user clicks the sign-up button, passing email, password, and confirm password.
 *  - onSignInClick: Function to execute when the user clicks the sign-in button, passing email and password.
 *  - onToggleSignInUp: Function to toggle between sign-in and sign-up modes.
 *  - loading: Boolean indicating if an asynchronous operation (sign-in or sign-up) is in progress.
 *  - error: Nullable string holding an error message from sign-in or sign-up operations.
 *  - passwordError: String holding an error message specific to password validation failures.
 *  - signUpSuccess: Boolean indicating if the user has successfully signed up.
 *
 * Author: Team Kyle
 * Last Modified: 2/12/23
 */

import React, { Dispatch, SetStateAction, useState, useCallback } from "react";

import { cn } from "@/utils/utils";
import { Poppins } from "next/font/google";

interface AuthFormProps {
  isSigningUp: boolean;
  emailInput: string;
  onEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  password: string;
  onPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSignUpClick: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  onSignInClick: (email: string, password: string) => Promise<void>;
  onToggleSignInUp: () => void;
  loading: boolean;
  error: string | null;
  passwordError: string;
  signUpSuccess: boolean;
}

const font = Poppins({
  weight: "400",
  subsets: ["latin"],
});

const AuthForm: React.FC<AuthFormProps> = ({
  isSigningUp,
  emailInput,
  onEmailChange,
  password,
  onPasswordChange,
  confirmPassword,
  onConfirmPasswordChange,
  onSignInClick,
  onSignUpClick,
  onToggleSignInUp,
  loading,
  error,
  passwordError,
  signUpSuccess,
}) => {
  return (
    <React.Fragment>
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        {signUpSuccess && (
          <div className="moon-cont">
            <p>Congratulations! Your Moon account is created.</p>
            <p>Now that you have created an account, sign in.</p>
          </div>
        )}
        <div className="moon-cont">
            <h2 className="text-2xl font-bold mb-4">
              {isSigningUp ? "Sign up for a Moon Account" : "Sign In"}
            </h2>
            {/** email input **/}
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={emailInput}
              onChange={onEmailChange}
            />
    
            {/** password input **/}
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={onPasswordChange}
            />
          

          {/** confirm password input **/}
          {isSigningUp && (
            
              <input
                type="password"
                placeholder="Confirm Password"
                className="input"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
              />
            
          )}
          {/* Button to submit the form, toggling between 'Sign Up' and 'Sign In' */}
        </div>
        <div className="moon-cont">
          <button
            type="button"
            className={cn("moon-btn3", font.className)}
            onClick={() =>
              isSigningUp
                ? onSignUpClick(emailInput, password, confirmPassword)
                : onSignInClick(emailInput, password)
            }
          >
            {loading
              ? isSigningUp
                ? "Signing up..."
                : "Signing in..."
              : isSigningUp
              ? "Sign up for a Moon Account"
              : "Sign In"}
          </button>
          {/* Button to toggle between signing in and signing up */}
          <button
            type="button"
            className={cn("moon-btn2", font.className)}
            onClick={onToggleSignInUp}
          >
            {isSigningUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </button>
          {/** Error message **/}
          {!isSigningUp
            ? error && <p className="text-red-500 ml-2">{error}</p>
            : passwordError && (
                <p className="text-red-500 ml-2">{passwordError}</p>
              )}
        </div>
      </form>
    </React.Fragment>
  );
};

export default AuthForm;
