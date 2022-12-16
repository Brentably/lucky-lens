
import { BigNumber, Contract, ethers } from 'ethers'
import { RaffleData } from '../../pages'
import { ALCHEMY_KEY_MUMBAI } from '../../pages/_app'
import LuckyLensJson from './LuckyLens.json'
// abi => api

export const defaultProvider = new ethers.providers.AlchemyProvider('maticmum', ALCHEMY_KEY_MUMBAI)

// exports ethers contract that can be connected to a signer with contract.connect(Signer)
// in the future can pre-connect to app's provider in here if read-only calls are prevalent in the app
export const LuckyLensMumbai:Contract = new ethers.Contract("0x1622E45Ec8297F4195C10A31e1e18c96D434D8C8", LuckyLensJson.abi, defaultProvider)
console.dir(LuckyLensMumbai)


// getting all raffles rn. not filtering for live raffles or anything.
export const getRaffles = async(address: string):Promise<any[]> => {

const postRaffleFilter = LuckyLensMumbai.filters.PostRaffle(address)
const postRaffleLogs = await LuckyLensMumbai.queryFilter(postRaffleFilter, -200000, 'latest') //hardcoded -200000 blocks ago to now
const cleanItUp = postRaffleLogs.map(log => ({owner: log.args?.owner, profileId: log.args?.profileId, pubId: log.args?.pubId, raffleId: log.args?.raffleId, time: log.args?.time}))
const justRaffleIds:BigNumber[] = cleanItUp.map(raffle => raffle.raffleId)
const randomNums = await LuckyLensMumbai.getRandomNums(justRaffleIds)

const final = []
for(let i = 0; i < cleanItUp.length; i++) {
  const {owner, profileId, pubId, raffleId, time: s_time} = cleanItUp[i]
  const randomNum = randomNums[i]
  
  let passed = false; 
  if(s_time.toString() == '1') passed = true
  if(Date.now() / 1000 > s_time) passed = true // Date.now() is in milliseconds but our time value should be in seconds
  const date = passed ? null : new Date(s_time*1000) // don't need to multiply by 1000, it takes seconds


  final.push({ //most are bignums so mapping to strings
    owner: owner,
    profileId: profileId.toString(),
    pubId: pubId.toString(),
    raffleId: raffleId.toString(),
    s_time: s_time,
    passed,
    date,
    randomNum: randomNum.toString()
  })
}

return final.reverse() // reverse to show newest first
}


export const getQualifiedEntrants = async(raffleId: string, requirements:string):Promise<any[]> => {
  // first thing to do is get the raffle data from the contract for the given raffleId
  const raffleData = await LuckyLensMumbai.Raffles(raffleId)
  const {profileId, pubId} = raffleData
  
  // now we can query the lens api with the profile / pub id to determine 1. who has commented and 2. if they follow the poster



  return []
}