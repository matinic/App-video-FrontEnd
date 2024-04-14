import React, { useEffect } from 'react'
import style from "./VideoCard.module.css"
import { useNavigate } from 'react-router-dom'
import {useStore} from "../../zustand/store"

const VideoCard = function({ video, showData, userChannel }){

const {url,title,id} = video

const isSubscribed = userChannel?.includes(video?.user?.id)
const profileImage = video?.user?.image

//Global state of pointer event attribute of video cards
const pointerEvent = useStore((state)=> state.pointerEvent)

const navigate = useNavigate() 

const goToVideo = ()=>{
  navigate(`/detail/${id}`)
}
const goToChannel = (e)=>{
    e.stopPropagation()
    navigate(`/channel/${video?.user?.username}`)
}
    return (
        <div className={style.videoCard} onClick={goToVideo} data-pointer={pointerEvent}>
    
            <video src = {url} className={style.thumbnail}/>
            <div className={style.videoInfo}>

                {
                    showData ?
                    <div className={style.profileImage}style={{
                        width: "45px",
                        height: "45px",
                        backgroundImage: `url("${profileImage || "https://www.pngall.com/wp-content/uploads/5/Profile-Avatar-PNG-Picture.png"}")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "50%",
                        flexShrink: "0"
                    }}></div>
                    : null
                }
            
                <div className={style.videoText}>
                    <h4>{title}</h4>
                    <a onClick={goToChannel}>{video.user?.username}</a>
                </div>
            </div>
            
            {
                isSubscribed && <p style={{color:'green'}}>subscribed</p>
            }

        </div>
    )
}

export default VideoCard