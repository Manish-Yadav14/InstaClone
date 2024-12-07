import React from 'react'

function GoogleAuth({prefix}) {
  return (
    <div className='flex justify-center items-center cursor-pointer'>
        <img className='h-5 m-2' src="/google.png" alt="" />
        <p className='text-blue-500 text-md font-semibold'> {prefix} with Google</p>  
    </div>
  )
}

export default GoogleAuth