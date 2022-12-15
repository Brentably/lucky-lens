
import { Contract, ethers } from 'ethers'
import LuckyLens from './LuckyLens.json'


// exports ethers contract that can be connected to a signer with contract.connect(Signer)
// in the future can pre-connect to app's provider in here if read-only calls are prevalent in the app
export const LuckyLensMumbai:Contract = new ethers.Contract("0x1BCD93fBEF7eAac86b8D2dA00773b45A875Dc4F3", LuckyLens.abi)