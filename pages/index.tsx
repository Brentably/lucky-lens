import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { client, getProfile } from '../lib/lensApi/api'
// import styles from '../styles/Home.module.css'
import { useConnectWallet } from '@web3-onboard/react'
import { ProfileFieldsFragment } from '../lib/lensApi/generated'
import { ethers } from 'ethers'
import { LuckyLensMumbai } from '../lib/contracts/address'
import { Web3OnboardProvider, init } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'


export type newRaffleData = {
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
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [profile, setProfile] = useState<ProfileFieldsFragment | null>(null)
  const [newRaffleData, setNewRaffleData] = useState<newRaffleData | null>(null)
  useEffect(() => console.log(newRaffleData), [newRaffleData])


  const handleNewRaffle = async () => {
    const {profileId, pubId, date, time, now} = newRaffleData!
    if(!profileId || !pubId) console.error('tried to create new Raffle without params')
    if(!(date && time) && !now) console.error('tried to create new Raffle without params')
    console.log("new giveaway with newRaffleData:", newRaffleData)
    // const LuckyLens = LuckyLensMumbai.connect(signer!) // not possible to be null b/c nothing in the app shows up until you connect
    // console.dir(LuckyLens)


    const solidityTime = new Date(date + " " + time).valueOf() // converts to seconds since epoch

    const timeParam = now ? 1 : solidityTime
    let tx
    // if(now) tx = await LuckyLens.newRaffleDrawNow(profileId, pubId)
    // if(!now) tx = await LuckyLens.postRaffle(profileId, pubId, timeParam)


  
    return null
  }
  


  // updates address, provider, signer based on web3Onboard's wallet
  useEffect(() => {
    if(wallet === null) return
    setAddress(wallet?.accounts[0].address)
    const provider = wallet ? new ethers.providers.Web3Provider(wallet.provider, 'any') : null
    provider ? setProvider(provider) : console.log('ooops, couldnt get provider. provider is', provider)
    const signer = provider?.getSigner() 
    signer ? setSigner(signer) : console.log('oops, couldnt get signer, signer is', signer)
    console.log('address, provider, signer connected')
  }, [wallet])

  // gets lens profile from connected address
  useEffect(() => {
    if(address === "") return
    async function effectCall() {
    const profile:(ProfileFieldsFragment | null) = address ? await getProfile(address) : null;
    setProfile(profile)
    }
    effectCall()
  }, [address])

  // const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  // const some =  Date.now()

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
        <div id="form" className='mt-4'>
          <div className='font-semibold text-lg my-2'>Create a new raffle:</div>

          <label className='block'>
              <div className='font-medium'>Profile ID (number)</div>
              <input type="number" onChange={e => setNewRaffleData(prevState => ({...prevState, profileId: e.target.value}))}/> 
          </label>
          <label className='block'>
              <div className='font-medium'>Publication ID (number)</div>
              <input type="number" onChange={e => setNewRaffleData(prevState => ({...prevState, pubId: e.target.value}))}/> 
          </label>
          <label className='block'>
              <div className='font-medium'>Raffle Time</div>

              Now?<input type="checkbox" className='m-3' checked={Boolean(newRaffleData?.now)} onChange={e => setNewRaffleData(prevState => ({...prevState, now: e.target.checked}))}/><br/>

              {!newRaffleData?.now ? <>
                <input type='date' value={newRaffleData?.date} onChange={e => setNewRaffleData(prevState => ({...prevState, date: e.target.value}))}/>
                <input type='time' value={newRaffleData?.time} onChange={e => setNewRaffleData(prevState => ({...prevState, time: e.target.value}))}/>
                {/* {timezone} */}
              </> : null}
              {/* <button className='form-input bg-slate-300' onClick={() => setNewRaffleData(prevState => ({...prevState, date: "0", time: "0"}))}>now</button> */}
          </label>
          <button disabled={!newRaffleData} className='mt-2 bg-green-700 text-white rounded-xl p-2' onClick={handleNewRaffle}>Create Raffle</button>
        </div>



         <div className='my-20'>Giveaways listed here</div>
        </>: null}

    </div>
  )
}
