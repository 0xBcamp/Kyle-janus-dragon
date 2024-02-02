import {
  Accounts,
  ContentType,
} from '@moonup/moon-api';

async function main() {
  const token = "your_auth_token_here"; // Define the token variable with your actual token
  const accountsSDK = new Accounts({
    baseUrl: 'https://vault-api.usemoon.ai',
    baseApiParams: {
      secure: true,
      type: ContentType.Json,
      format: 'json',
    },
    //defined to inject the authorization header into each request
    securityWorker: async (securityData) => {
      return Promise.resolve({
        headers: {
          Authorization: `Bearer ${securityData.token}`,
        },
      });
    }
  });

  accountsSDK.setSecurityData({
    token: token, // get from authentication object 
  });

  const account = await accountsSDK.getAccount('');
  console.log(account);
}

// Make sure to call main() or handle it appropriately in your code
main().catch(console.error);
