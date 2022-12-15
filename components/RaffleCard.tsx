import { RaffleData } from "../pages"

const RaffleCard = (props:RaffleData) => {
  const { owner, profileId, pubId, raffleId, time, passed, date} = props
return(
    <div className='bg-gray-400 border-black border-2 py-2'>

    profileId: {profileId}, pubId: {pubId}, raffleId: {raffleId}, time: {time}

    </div>
)
}

export default RaffleCard