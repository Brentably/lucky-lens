import { BigNumber } from "ethers/lib/ethers"

export type NewRaffleData = {
  profileId?: string,
  pubId?: string,
  date?: string,
  time?: string,
  now?: boolean
}

// call something else
export type postedRaffleLog = {
  owner: string,
  profileId: BigNumber,
  pubId: BigNumber,
  raffleId: BigNumber,
  time: BigNumber,
  randomNum?: BigNumber
}

export interface RaffleStruct {
  owner: string,
  profileId: string,
  pubId: string,
  raffleId: string,
  time: string,
  randomNum: string
}

export interface RaffleData extends RaffleStruct {
  time: string, //time in seconds
  passed: boolean,
  date: Date,
}


