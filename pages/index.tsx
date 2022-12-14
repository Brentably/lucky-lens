import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { client, getProfile } from '../lib/lensApi/api'
// import styles from '../styles/Home.module.css'
import { useConnectWallet } from '@web3-onboard/react'
import { ProfileFieldsFragment } from '../lib/lensApi/generated'
import { ethers } from 'ethers'
import {handleNewRaffle} from '../helpers/handlers'


type newRaffleData = {
  profileId?: string,
  pubId?: string,
  date?: string,
  time?: string,
  now?: boolean
}


export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [address, setAddress] = useState<string | undefined>("")
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [profile, setProfile] = useState<ProfileFieldsFragment | null>(null)
  const [newRaffleData, setNewRaffleData] = useState<newRaffleData | null>(null)
  useEffect(() => console.log(newRaffleData), [newRaffleData])


  // updates address and provider based on web3Onboard's wallet
  useEffect(() => {
    setAddress(wallet?.accounts[0].address)
    let provider = wallet ? new ethers.providers.Web3Provider(wallet.provider, 'any') : null
    setProvider(provider)
    console.log('address and provider connected')
  }, [wallet])

  // gets lens profile from connected address
  useEffect(() => {
    async function effectCall() {
    const profile:(ProfileFieldsFragment | null) = address ? await getProfile(address) : null;
    setProfile(profile)
    }
    effectCall()
  }, [address])

  return (
    <div className='pt-10 text-center h-screen'>
      <Head>
        <title>Create Next App</title>
        <meta name="Lucky lens" content="Lucky Lens is a way to verifiably randomly choose a winner for a giveaway" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="header">
        <h1 className='text-4xl m-2'>Lucky Lens</h1>
        <button className='bg-green-700 text-white rounded-xl p-2 mt-2 w-28' disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
          {connecting ? 'connecting' : wallet ? 'disconnect' : 'connect'}
        </button>
        {profile ?  // they don't actually need a lens profile to use the app, but it will probably be useful to have it in the future
          <div className='mt-2'>
            {`Hello @${profile.handle}! Welcome to Lucky Lens :)`}
          </div>
        : null}
      </div>

        {address ? <>

          {/* form is supposed to look bad rn */}
         <label className='block'>
          <div>Profile ID (number)</div>
          <input type="number" onChange={e => setNewRaffleData(prevState => ({...prevState, profileId: e.target.value}))}/> 
         </label>
         <label className='block'>
          <div>Publication ID (number)</div>
          <input type="number" onChange={e => setNewRaffleData(prevState => ({...prevState, pubId: e.target.value}))}/> 
         </label>
         <label className='block'>
          <div>Raffle Time</div>

          Now?<input type="checkbox" className='m-3' checked={newRaffleData?.now} onChange={e => setNewRaffleData(prevState => ({...prevState, now: e.target.checked}))}/><br/>

          {!newRaffleData?.now ? <>
          <input type='date' value={newRaffleData?.date} onChange={e => setNewRaffleData(prevState => ({...prevState, date: e.target.value}))}/>
          <input type='time' value={newRaffleData?.time} onChange={e => setNewRaffleData(prevState => ({...prevState, time: e.target.value}))}/>
          </> : null}
          {/* <button className='form-input bg-slate-300' onClick={() => setNewRaffleData(prevState => ({...prevState, date: "0", time: "0"}))}>now</button> */}
         </label>
         <button className='mt-10 bg-green-700 text-white rounded-xl p-2' onClick={() => handleNewRaffle(newRaffleData)}>Create Raffle</button>




         <div className='my-20'>Giveaways listed here</div>
        </>: null}

    </div>
  )
}
