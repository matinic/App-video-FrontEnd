import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useVideo, useUser } from '../../hooks/queryHooks'
import style from "./Detail.module.css"
import { usePublish } from '../../hooks/mutationHooks'
import SouthIcon from '@mui/icons-material/South';
import EditIcon from '@mui/icons-material/Edit';
import { Portal } from '@mui/material';
import Edit from '../edit/Edit';
import ChannelCard from '../channelCard/channelCard';
import LikesBar from '../likesBar/LikesBar';

export default function Detail() {

const params = useParams()

//Query that get all video information, included the channel 
const {data:video, isError, isLoading} = useVideo(params.id)

const {data:user} = useUser()

const [showEditVideo,setShowEditVideo] = useState(true)

const isAuthorized = video?.data.user.username !== user?.data?.username

const [expandDescription,setExpandDescription] = useState(false)

const {mutate:publish} = usePublish(video?.data?.id)

React.useEffect(()=>{
  return ()=>{
    setShowEditVideo(false)
  }
},[])

if(isLoading) {
  return(
    <h1>
      Loading...
    </h1>
  )
}

if(isError) return(
    <h1>Something went wrong</h1>
)

return (
    <div className={style.detailContainer}>

        {/*Video player*/}
        <video src={video?.data?.url} controls className={style.videoPlayer}>
        </video>
        {
          !isAuthorized &&
          <div className={style.videoOptions}>
            <button className={style.edit} onClick={()=>setShowEditVideo(!showEditVideo)}>
              <EditIcon fontSize='medium'></EditIcon>
                <>Edit</>
            </button>
            <button 
              onClick={()=>publish(!video?.data?.published)}
              data-published={!video?.data?.published}
            >
              hide
            </button>
          </div>
        }
        {
          showEditVideo && <Portal children={
            <Edit 
              close ={setShowEditVideo}
              videoInfo ={video?.data}
              isOpen = {showEditVideo}
            ></Edit>}></Portal>
        }
        <h2 className={style.videoTitle}>{video.data?.title}</h2> 
        <div className={style.channelContainer}>
          <ChannelCard
            data = {video.data.user}
            image
            subscribers
            center
            subscribe
            title
            row
            navigate
          >
          </ChannelCard>
          <LikesBar video={video.data}></LikesBar>
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
