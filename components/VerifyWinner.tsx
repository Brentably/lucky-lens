import { useEffect, useState } from "react"
import { getQualifiedEntrants } from "../lib/contracts/LuckyLens/LuckyLens"


const VerifyWinner = () => {
  const [raffleId, setRaffleId] = useState<string>('')
  const [checked, setChecked] = useState<string>('')
  useEffect(()=>console.log(raffleId),[raffleId])

  const handleVerify = async () => { 
    if(!raffleId || !checked) return
    console.log('verifying winner')
    const qualifiedEntrants = await getQualifiedEntrants(raffleId, checked)
  }



return (
<div className='mt-6 max-w-lg mx-auto'>
  <div className='text-lg font-medium'>Verify Winner</div>
  <label className='block'>
      <div className='font-medium'>Raffle ID</div>
      <input type="number" onChange={e => setRaffleId(e.target.value)}/> 
  </label>
  <div>
      <div className='font-medium'>Entry requirements</div>

  <label className='block'>
        <input type="radio" checked={checked == '1'} value='1' onChange={(e) => setChecked(e.target.value)}/>must comment
  </label>
  <label className='block'>
        <input type="radio" checked={checked == '2'} value='2' onChange={(e) => setChecked(e.target.value)}/>must follow and comment
  </label>

  </div>
  <button className='mt-2 bg-green-700 text-white rounded-xl p-2' onClick={handleVerify}>Verify</button>
  </div>
)
}

export default VerifyWinner