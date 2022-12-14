import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'


const rpcUrl = 'https://polygon-mumbai.g.alchemy.com/v2/LlPfIiQ_9R3vvvqY5HOadGN68ej0_I9z'

const injected = injectedModule()
const walletConnect = walletConnectModule()
const web3onboard = init({
  wallets: [injected, walletConnect],
  chains: [
    {
      id: 80001,
      token: 'MATIC',
      label: 'Polygon Mumbai',
      rpcUrl
    }
  ]
})


export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
