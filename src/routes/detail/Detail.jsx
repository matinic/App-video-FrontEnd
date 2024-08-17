import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { useVideo } from '../../hooks/queryHooks'
import style from "./Detail.module.css"
import ChannelCard from '../channelCard/channelCard';
import { useUser } from '../../hooks/queryHooks'
import LikesBar from '../likesBar/LikesBar';
import EditVideoButtons from '../editVideoButtons/editVideoButtons';
import SouthIcon from '@mui/icons-material/South';
import * as mutate from "../../hooks/mutationHooks"


export default function Detail() {

const params = useParams()

const {data:video, isError, isLoading, isSuccess } = useVideo(params.id)

const {data:user} = useUser()

const navigate = useNavigate()

const isVideoOwner = video?.data?.user?.username === user?.data?.username

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
    <div className={style.detailContainer}>
        {/*Video player*/}
        <video
          src = { video?.data.url }
          className = { style.videoPlayer }
          controls
        >
        </video>
        {
        isVideoOwner &&
          <EditVideoButtons
            data = { video?.data }
            edit
            hide
            delete
          />
        }
        <h2 className={style.videoTitle}>{video?.data.title}</h2> 
        <div className={style.channelContainer}>
          <ChannelCard
            data = {video?.data.user}
            image
            subscribers
            center
            subscribe
            title
            row
            navigate
          >
          </ChannelCard>
          <LikesBar video={video?.data}></LikesBar>
        </div>
         
        <pre
          className={style.videoDescription}
          data-expand={expandDescription}
        >
          {`${video?.data?.description}`}
        </pre>
        <p 
          className={style.expandButton}
          onClick={()=>setExpandDescription(!expandDescription)}
          data-expand={expandDescription}
        >
          <SouthIcon style={{fontSize: 'small'}}></SouthIcon>
        </p>
    </div>
  )
}
