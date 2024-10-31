import React from 'react'

function Rewards() {
  return (
    <div className='w-full h-full rounded-xl border-2 border-gray-400 p-2'>
        <span className='font-bold text-gray-500'>Rewards</span>
        <div className='flex justify-between items-center'>
            <div className='flex gap-3'>
                <img src="./images/logo.png" alt="logo" className='w-6 h-6' />
                <span className='font-semibold'>0.05021</span>
                <span className='font-semibold'>iFarm</span>
            </div>
            <button className='p-1 rounded-xl bg-yellow-500'>Claim</button>
        </div>
    </div>
  )
}

export default Rewards