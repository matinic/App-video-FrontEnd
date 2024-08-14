import React,{useState,useEffect} from 'react'
import style from "./VideoCard.module.css"
import { useNavigate } from 'react-router-dom'

const VideoCard = function({video, children}){

const navigate = useNavigate() 

const goToVideo = ()=>{
  navigate(`/detail/${video?.id}`)
}

return (
    <div className={style.videoCard} onClick={goToVideo}>
        <video src = {video?.url} className={style.thumbnail}/>
        <h4>
            {children}
        </h4>
    </div>
)}

export default VideoCard