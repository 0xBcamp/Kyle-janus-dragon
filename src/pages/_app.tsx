import '@/styles/styles.css';
import '@/styles/mediaqueries.css';
import type { AppProps } from 'next/app'
import {
  Accounts,
  ContentType,
} from '@moonup/moon-api';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
