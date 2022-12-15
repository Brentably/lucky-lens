
import { Contract, ethers } from 'ethers'
import LuckyLens from './LuckyLens.json'
// abi => api

// exports ethers contract that can be connected to a signer with contract.connect(Signer)
// in the future can pre-connect to app's provider in here if read-only calls are prevalent in the app
export const LuckyLensMumbai:Contract = new ethers.Contract("0x8649B353E95801A611554f447ff1Db72C7F00BB0", LuckyLens.abi)


// getting all raffles rn. not filtering for live raffles or anything.
export const getRaffles = async(address: string, provider: ethers.providers.Web3Provider):Promise<any[]> => {

const LuckyLens = LuckyLensMumbai.connect(provider)
const 

return []
}