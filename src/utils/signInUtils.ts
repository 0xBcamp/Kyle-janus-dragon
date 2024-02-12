/**
 * Checks if the provided password and confirmPassword match.
 * @param password The user's password.
 * @param confirmPassword The user's confirmed password.
 * @returns A boolean indicating if the passwords match, and an error message if they don't.
 */

import { EmailLoginInput, EmailSignupInput } from '@moonup/moon-api';
import { MoonSDK } from '@moonup/moon-sdk';

export const checkPasswordsMatch = (password: string, confirmPassword: string): [boolean, string] => {
    if (password === confirmPassword) {
        return [true, ''];
    } else {
        return [false, 'Passwords do not match'];
    }
};

/**
 * Signs up a new user with their email and password.
 */
export async function signUpUser(moon: MoonSDK, email: string, password: string): Promise<void> {
  const auth = moon.getAuthSDK();
  const signupRequest: EmailSignupInput = { email, password };
  await auth.emailSignup(signupRequest);
}

/**
 * Signs in an existing user with their email and password.
 */
export async function signInUser(moon: MoonSDK, email: string, password: string): Promise<string[]> {
  const auth = moon.getAuthSDK();
  const loginRequest: EmailLoginInput = { email, password };
  const loginResponse = await auth.emailLogin(loginRequest);
  return [loginResponse.data.token, loginResponse.data.refreshToken]; // Assuming token is what you need, adjust as necessary
}
