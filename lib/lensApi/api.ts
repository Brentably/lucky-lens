

import { BigNumber } from 'ethers';
import { createClient } from 'urql'
import { DefaultProfileRequest, ProfileQueryRequest, ProfilesDocument, DefaultProfileDocument, Profile, ProfileFieldsFragment, PublicationDocument, PublicationQueryRequest } from './generated';


const API_URL = 'https://api-mumbai.lens.dev'

export const client = createClient({
  url: API_URL,
})

// going to try a default profile, and if there isn't one, then just get the first profile from the list.
// in the future, can add selector if needed
export const getProfile = async (address: string):Promise<ProfileFieldsFragment>=> {
  // const defaultReq:DefaultProfileRequest = {ethereumAddress: address}
  // const defaultResult = await client.query(DefaultProfileDocument, {request: defaultReq} ).toPromise()
  // console.log(defaultResult.data?.defaultProfile)
  // if(defaultResult.data?.defaultProfile) return defaultResult.data.defaultProfile

  const backupRequest:ProfileQueryRequest = {ownedBy: [address]}
  const result = await client.query(ProfilesDocument, {request: backupRequest} ).toPromise()
  console.log(result)
  console.log(result.data?.profiles.items[0])
  return result.data!.profiles.items[0]
};

export const getPublication = async (profileId: BigNumber, pubId: BigNumber):Promise<any> => {
  const internalPublicationId = `${profileId.toHexString()}-${pubId.toHexString()}`
  const request:PublicationQueryRequest = {publicationId: internalPublicationId}
  const result = await client.query(PublicationDocument, {request}).toPromise()
  console.log(result)
  return result
}