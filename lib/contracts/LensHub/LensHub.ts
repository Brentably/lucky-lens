import { profile } from 'console';
import { BigNumber } from 'ethers';
import { createClient, gql } from 'urql'



const API_URL = 'https://api.thegraph.com/subgraphs/name/brentably/lens-mumbai'

export const client = createClient({
  url: API_URL,
})


export const getComments = async (profileId: string, pubId: string, time:number):Promise<any> => {
  const commentQuery = gql`{
    commentCreateds(
      first: 10
      orderBy: timestamp
      orderDirection: desc
      where: {profileIdPointed: $profileIdPointed, pubIdPointed: $pubIdPointed}
    ) {
      id
      profileId
      pubId
      pubIdPointed
      blockTimestamp
      blockNumber
    }
  }`

  const result = await client.query(commentQuery, {profileIdPointed: profileId, pubIdPointed: pubId}).toPromise()
  console.log(result)

  return []
}




// export const getProfile = async (address: string):Promise<ProfileFieldsFragmt>=> {
//   // const defaultReq:DefaultProfileRequest = {ethereumAddress: address}
//   // const defaultResult = await client.query(DefaultProfileDocument, {request: defaultReq} ).toPromise()
//   // console.log(defaultResult.data?.defaultProfile)
//   // if(defaultResult.data?.defaultProfile) return defaultResult.data.defaultProfile

//   const backupRequest:ProfileQueryRequest = {ownedBy: [address]}
//   const result = await client.query(ProfilesDocument, {request: backupRequest} ).toPromise()
//   console.log(result.data?.profiles.items[0])
//   return result.data!.profiles.items[0]
// };
