
import { Contract, ethers } from 'ethers'
import { postedRaffle } from '../../pages'
import { ALCHEMY_KEY_MUMBAI } from '../../pages/_app'
import LuckyLensJson from './LuckyLens.json'
// abi => api

export const defaultProvider = new ethers.providers.AlchemyProvider('maticmum', ALCHEMY_KEY_MUMBAI)

// exports ethers contract that can be connected to a signer with contract.connect(Signer)
// in the future can pre-connect to app's provider in here if read-only calls are prevalent in the app
export const LuckyLensMumbai:Contract = new ethers.Contract("0x7C7181e478FA49cE1Ca658aa7BF138cA9748a022", LuckyLensJson.abi, defaultProvider)
console.dir(LuckyLensMumbai)


// getting all raffles rn. not filtering for live raffles or anything.
export const getRaffles = async(address: string):Promise<any[]> => {

const postRaffleFilter = LuckyLensMumbai.filters.PostRaffle(address)
const postRaffleLogs = await LuckyLensMumbai.queryFilter(postRaffleFilter, -200000, 'latest') //hardcoded -200000 blocks ago to now
console.log(postRaffleLogs)
const final = []

for(let i = 0; i < postRaffleLogs.length; i++) {

  const {owner, profileId, pubId, raffleId, time} = postRaffleLogs[i].args!
  let passed; 
  if(time.toString() == '1') passed = true
  const raffleTime = passed ? null : new Date(time)

  const data = await LuckyLensMumbai.Raffles(raffleId)


  final.push({ //most are bignums so mapping to strings
    owner: owner,
    profileId: profileId.toString(),
    pubId: pubId.toString(),
    raffleId: raffleId.toString(),
    time: time.toString(),
  })
}




return final.reverse() // reverse to show newest first
}