import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { client, getProfile } from '../lib/lensApi/api'
// import styles from '../styles/Home.module.css'
import { useConnectWallet } from '@web3-onboard/react'
import { ProfileFieldsFragment } from '../lib/lensApi/generated'





export default function Home() {
  const [profile, setProfile] = useState<ProfileFieldsFragment | null>(null)
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [address, setAddress] = useState<string | undefined>("")



  useEffect(() => setAddress(wallet?.accounts[0].address), [wallet])

  useEffect(() => {
    async function effectCall() {
    const profile:(ProfileFieldsFragment | null) = address ? await getProfile(address) : null;
    setProfile(profile)
    }
    effectCall()
  }, [address])

  return (
    <div className='main pt-10 text-center'>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className='text-4xl m-2'>Lucky Lens</h1>
      <button className='bg-green-700 text-white rounded-xl p-2 mt-2 w-28' disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
        {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
      </button>
      {profile ? 
        <div className='mt-20'>
          {`Hello @${profile.handle}! Welcome to Lucky Lens :)`}
        </div>
      : null}
    </div>
  )
}
