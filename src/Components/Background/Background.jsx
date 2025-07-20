import React from 'react'
import "./Background.css"
import Backgroundimage from '../Assets/peakpx.jpg'
 const Background = () => {
  return (
    <div>
        <img className='Background-image' src={Backgroundimage} alt="" />
    </div>
  )
}

export default Background
