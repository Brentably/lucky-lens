import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'





export default function App({ Component, pageProps }: AppProps) {
  return ( 
  
    <Component {...pageProps} /> 

  )
}
