import { BigNumber } from "ethers/lib/ethers"

export type NewRaffleData = {
  profileId?: string,
  pubId?: string,
  date?: string,
  time?: string,
  now?: boolean
}


export type postedRaffleLog = {
  owner: string,
  profileId: BigNumber,
  pubId: BigNumber,
  raffleId: BigNumber,
  time: number
}

export interface RaffleStruct {
  owner: string,
  profileId: string,
  pubId: string,
  raffleId: string,
  time: number,
  randomNum: string
}

export interface RaffleData extends RaffleStruct {
  time: number, //time in seconds
  passed: boolean,
  date: Date,
}


