import { useEffect, useRef, useState } from "react"
import { RaffleData } from "../pages"
import prettyMilliseconds from 'pretty-ms';


// 3 cases here: the raffle hasn't ended, The raffle HAS ended but a winner has not been chosen (random num == 0), 
// or the raffle has ended and a winner has been chosen (randomNum exists)
const RaffleCard = (props:RaffleData) => {
  const { owner, profileId, pubId, raffleId, s_time, passed, date} = props
  const init = passed ? 0 : Math.floor((s_time - Date.now()/1000))
  const [timer, setTimer] = useState<number>(init)

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer(t => t-1)
    }, 1000)

    console.log('bong')
    return () => clearInterval(timerId)
  }, [])
  

let interval = timer > 0 ? prettyMilliseconds(timer*1000) : null
return (
    <div className='bg-gray-400 border-black border-2 py-2'>

    profileId: {profileId}, pubId: {pubId}, raffleId: {raffleId}, {interval ?
     `raffle ends in ${interval}`
     : 
     null}

    </div>
)
}

export default RaffleCard