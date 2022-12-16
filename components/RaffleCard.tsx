import { useEffect, useRef, useState } from "react"
import { RaffleData } from "../pages"
import prettyMilliseconds from 'pretty-ms';

interface RaffleCard extends RaffleData {
  generateWinner: () => void
}



// 3 cases here: the raffle hasn't ended, The raffle HAS ended but a winner has not been chosen (random num == 0), 
// or the raffle has ended and a winner has been chosen (randomNum exists)
const RaffleCard = (props:RaffleCard) => {
  const { owner, profileId, pubId, raffleId, s_time, passed, date, randomNum, generateWinner} = props
  const init = passed ? 0 : Math.floor((s_time - Date.now()/1000))
  const [timer, setTimer] = useState<number>(init)


  useEffect(() => {
    const timerId = setInterval(() => {
      setTimer(t => t-1)
    }, 1000)

    console.log('bong')
    return () => clearInterval(timerId)
  }, [])
  
  let canVerify = timer <= 0 && randomNum != "0"
  let canGenerate = timer <= 0 && randomNum == "0"
  let interval = timer > 0 ? `raffle ends in ${prettyMilliseconds(timer*1000).split(" ").join("_")}, `  : null
  return (
      <div className='border-black border -mt-px '>

      profileId: {profileId}, pubId: {pubId}, raffleId: {raffleId}, {interval} 
      hasWinner: {String(canVerify)}
      {canVerify ? 
        <button className='bg-neutral-400 p-2 rounded-xl' onClick={()=>console.log(`verifying winner on raffle ${raffleId}`)}>verify</button> 
        : null}

      {canGenerate ? 
        <button className='bg-neutral-400 p-1 rounded-xl' onClick={generateWinner}>generate winner!</button> 
      : null}



      </div>
  )
}

export default RaffleCard