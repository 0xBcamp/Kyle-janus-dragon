import { MoonAccount, Chain } from "@moonup/types";



const chain: Chain={
    chainId: '',
    chainName: '',
    nativeCurrency: {
        name: '',
        symbol: '',
        decimals: 69,
    },
    rpcUrls: ['','',''],
    blockExplorerUrls:['','',],
}

const account: MoonAccount= {
    token: 'string',
    refreshToken: 'string',
    email: 'string',
    expiry: 1,
    wallet: 'string',
    network: chain,
};