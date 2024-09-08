import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { useVideo } from '../../hooks/queryHooks'
import style from "./Detail.module.css"
import ChannelCard from "../channelCard/ChannelCard"
import { useUser } from '../../hooks/queryHooks'
import LikesBar from '../likesBar/LikesBar';
import EditVideoButtons from '../editVideoButtons/editVideoButtons';

export default function Detail() {

const params = useParams()

const {data:video, isError, isLoading, isSuccess } = useVideo(params.id)

const {data:user} = useUser()

const navigate = useNavigate()

const isVideoOwner = video?.data?.user?.username === user?.data?.username

const videoRef = React.useRef()

React.useEffect(()=>{
  if(videoRef.current){
    videoRef.current.play()
    videoRef.current.volume = 0.5
  } 
},[videoRef.current])


const [expandDescription,setExpandDescription] = useState(false)

if(isLoading) return (
    <h3 className={style.detailContainer}>
      Loading...
    </h3>
)

if(isError) return (
  <h2 className={style.detailContainer}>
    NOT FOUND 404 <span onClick={()=> navigate("/")}>return home</span>
  </h2>
)

if(isSuccess) return (
    <main className={style.detailContainer}>
        {/*Video player*/}
        <div className={style.dataBlock}>
          <video
            ref = { videoRef }
            src = { video.data.url }
            className = { style.videoPlayer }
            controls
          >
          </video>
          {
          isVideoOwner &&
            <EditVideoButtons
              data = { video.data }
              edit
              hide
              delete
            />
          }
          <h2 className={style.videoTitle}>{video.data.title}</h2> 
          <div className={style.channelContainer}>
            <ChannelCard
              data = { video.data.user }
              image
              subscribers
              center
              subscribe
              name
              size = "row"
              navigate
            />
            <LikesBar
              data = { video.data }
              like
              dislike
              counter
            />
          </div>
        </div>

        <div style={{position: "relative"}}>
          <pre  className={style.videoDescription}
            data-expand={expandDescription}
          >
            {!!video.data.description ? video.data.description : <pre style={{fontStyle:"italic",color:"gray"}}>(There is no decription)</pre>}
          </pre>
        </div>
    </main>
  )
}
