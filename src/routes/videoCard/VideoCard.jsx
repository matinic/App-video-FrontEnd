import React, { useEffect } from 'react'
import style from "./VideoCard.module.css"
import imageDefault from "../../assets/profile-image.png"
import { useNavigate } from 'react-router-dom'

const VideoCard = function({ video, showData, userChannel }){

const {url,title,id} = video

const isSubscribed = userChannel?.includes(video?.user?.id)

const navigate = useNavigate() 

const goToVideo = ()=>{
  navigate(`/detail/${id}`)
}
const goToChannel = (e)=>{
    e.stopPropagation()
    navigate(`/channel/${video?.user?.username}`)
}


    return (
        <div className={style.videoCard} onClick={goToVideo}>
    
            <video src = {url} className={style.thumbnailContainer}/>

            <div className={style.videoInfo}>
                
                {
                    showData ?
                    <img src={video?.user?.image || imageDefault} alt="" onClick={goToChannel}/>
                    : null
                }
            
                <div className={style.titleAndName}>
                    <h4>{title}</h4>
                    <a onClick={goToChannel}>{video.user?.username}</a>
                </div>
                
                {
                    isSubscribed && <p style={{color:'green'}}>subscribed</p>
                }

            </div>
        </div>
    )
}

export default VideoCard