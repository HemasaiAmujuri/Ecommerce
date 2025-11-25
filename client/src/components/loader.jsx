import React from 'react'
import { ClipLoader } from "react-spinners"
import '../styles/loader.css'

function Loader({loading}){
   return(
    <div className='loader'>
     <ClipLoader 
     loading={loading}
    color="#FFFFFF"
    size={50}/> 
    </div>
   )
}



export default Loader;