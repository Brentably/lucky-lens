import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { client, getProfile } from '../lib/lensApi/api'
import { useAppState, useConnectWallet } from '@web3-onboard/react'
import { ProfileFieldsFragment } from '../lib/lensApi/generated'
import { BigNumber, ethers } from 'ethers'
import { getRaffles, LuckyLensMumbai } from '../lib/contracts/LuckyLens/LuckyLens'
import RaffleCard from '../components/RaffleCard'
import VerifyWinner from '../components/VerifyWinner'
import { NewRaffleData, RaffleData } from '../lib/types/types'




export default function Home() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const [address, setAddress] = useState<string>("")
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [profile, setProfile] = useState<ProfileFieldsFragment | null>(null)
  const [newRaffleData, setNewRaffleData] = useState<NewRaffleData | null>(null)
  useEffect(() => console.log(newRaffleData), [newRaffleData])
  const [raffles, setRaffles] = useState<RaffleData[] | null>(null)
  useEffect(() => console.log(raffles), [raffles])

  // lucky lens frontend => lucky lens contract
  const handleNewRaffle = async () => {
    const {profileId, pubId, date, time, now} = newRaffleData!
    if(!profileId || !pubId) console.error('tried to create new Raffle without params')
    if(!(date && time) && !now) console.error('tried to create new Raffle without params')
    console.log("new giveaway with newRaffleData:", newRaffleData)
    const LuckyLens = LuckyLensMumbai.connect(signer!) // not possible to be null b/c nothing in the app shows up until you connect
    console.dir(LuckyLens)

    const winnerFilter = LuckyLensMumbai.filters.RequestFulfilled()
    LuckyLensMumbai.once(winnerFilter, () => updateRaffles(address))
    // set handling for state update.
    const postRaffleFilter = LuckyLensMumbai.filters.PostRaffle(address)
    LuckyLensMumbai.once(postRaffleFilter, () => updateRaffles(address))


    const s_timeParam = now ? 1 : new Date(date + " " + time).valueOf()/1000 // converts to seconds since epoch
    console.log(s_timeParam)
    if(s_timeParam < Date.now()/1000 && s_timeParam != 1) console.error('invalid time param')

    let tx
    try{
    if(now) tx = await LuckyLens.newRaffleDrawNow(profileId, pubId)
    if(!now) tx = await LuckyLens.postRaffle(profileId, pubId, s_timeParam)
    } catch(err) {
      console.log(err)
    }
    console.log(tx)
  
    return null
  }

  // lucky lens frontend => lucky lens contract
  const handleGenerateWinner = async (raffleId: string) => {
    const LuckyLens = LuckyLensMumbai.connect(signer!) // not possible to be null b/c nothing in the app shows up until you connect
    console.log(`generating winner for raffle ${raffleId}`)


    const winnerFilter = LuckyLensMumbai.filters.RequestFulfilled(raffleId)
    LuckyLensMumbai.once(winnerFilter, () => updateRaffles(address))

    let tx
    try{
    tx = await LuckyLens.chooseRandomWinner(raffleId)
    } catch(err) {
      console.log(err)
    }
    console.log(tx)
  }

  // updates address, provider, signer based on web3Onboard's wallet
  useEffect(() => {
    setAddress(wallet?.accounts[0].address || "")
    const provider = wallet ? new ethers.providers.Web3Provider(wallet.provider, 'any') : null
    provider ? setProvider(provider) : console.log('ooops, couldnt get provider. provider is', provider)
    const signer = provider?.getSigner() 
    signer ? setSigner(signer) : console.log('oops, couldnt get signer, signer is', signer)
    console.log('address, provider, signer connected')
  }, [wallet])

  
  // gets lens profile from connected address
  async function updateProfile(address: string) {
    setProfile(await getProfile(address))
  }
  // gets raffles from connected address
  async function updateRaffles(address: string) {
    setRaffles(await getRaffles(address))
  }
  
  // fetch lens profile and live raffles from current address
  useEffect(() => {
    if(!address) return
    updateProfile(address)
    updateRaffles(address)
  }, [address])


  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  return (
    <div className='pt-10 text-center mx-auto my-10 py-10 max-w-3xl'>
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

                <span className='inline-block mb-2'>Now?</span><input type="checkbox" className='mx-2 mb-1' checked={Boolean(newRaffleData?.now)} onChange={e => setNewRaffleData(prevState => ({...prevState, now: e.target.checked}))}/><br/>

                {!newRaffleData?.now ? <>
                  <input type='date' value={newRaffleData?.date} onChange={e => setNewRaffleData(prevState => ({...prevState, date: e.target.value}))}/>
                  <input type='time' value={newRaffleData?.time} onChange={e => setNewRaffleData(prevState => ({...prevState, time: e.target.value}))}/>
                  <span className='ml-1'>{timezone}</span>
                </> : null}

            </label>
            <button disabled={!newRaffleData} className='mt-2 bg-green-700 text-white rounded-xl p-2' onClick={handleNewRaffle}>Create Raffle</button>
          </div>

          {raffles !== null ? <>

          {raffles.length == 0 && <div className='my-20'>no raffles found</div>}
          
          <div className='max-w-lg mx-auto mt-6'>
            <div className='text-lg'>Your Raffles:</div>
            {raffles.map(raffle => <RaffleCard key={raffle.raffleId} {...raffle} generateWinner={() => handleGenerateWinner(raffle.raffleId)}/>)}
          </div>
          </> : <div className='my-20'>loading raffles</div>}
        </>: null}


        <VerifyWinner/>

        
    </div>
  )
}
