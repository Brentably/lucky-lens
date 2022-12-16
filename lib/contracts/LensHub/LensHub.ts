import { ALCHEMY_KEY_MUMBAI } from '../../../pages/_app'
import EventsJson from './Events.json'
import { Contract, ethers } from 'ethers'
// abi => api

export const defaultProvider = new ethers.providers.AlchemyProvider('maticmum', ALCHEMY_KEY_MUMBAI)

// exports ethers contract that can be connected to a signer with contract.connect(Signer)
// in the future can pre-connect to app's provider in here if read-only calls are prevalent in the app
export const LensHubProxy:Contract = new ethers.Contract("0x60Ae865ee4C725cd04353b5AAb364553f56ceF82", EventsJson.abi, defaultProvider)


