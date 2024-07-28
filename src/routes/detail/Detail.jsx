import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useVideo, useUser } from '../../hooks/queryHooks'
import style from "./Detail.module.css"
import imageDefault from "../../assets/profile-image.png"
import { useLikeVideo, useSubscribe, usePublish } from '../../hooks/mutationHooks'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import SouthIcon from '@mui/icons-material/South';
import EditIcon from '@mui/icons-material/Edit';
import { Portal } from '@mui/material';
import Edit from '../edit/Edit';

export default function Detail() {

const params = useParams()

//Query that get all video information, included the channel 
const {data:video, isError, isLoading} = useVideo(params.id)

//Gets the user info from the video query (user who is owner of the video)
const channel = video?.data?.user

//from the video query 
const navigate = useNavigate()

//Logged user
const {data:user} = useUser()

//Verifies if the logged user is sunsdcribed to the cannel
//?This can be transform to a hook
const isSubscribed = user?.data?.subscriptions?.includes(channel?.id) 

const {mutate:mutateLike} = useLikeVideo(video?.data?.id)

//Mutation that of subscribe action onto the channel
const {mutate:subscribe} = useSubscribe()

const isLiked = user?.data?.likedVideos.includes(video?.data?.id)
const isDisliked = user?.data?.dislikedVideos.includes(video?.data?.id)

const [showEditVideo,setShowEditVideo] = useState(true)

React.useEffect(()=>{
  return ()=>{
    setShowEditVideo(false)
  }
},[])

const isAuthorized = channel?.username !== user?.data?.username

const [expandDescription,setExpandDescription] = useState(false)

const {mutate:publish} = usePublish(video?.data?.id)

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
        
        {/*Video title*/}

        <div className={style.channelContainer}>

          {/*Link to the main channel*/} 
            <Link
              to={`/channel/${channel?.username}`}
              className={style.channel}
            >
              <div className={style.profileImage}>
                
                <img
                  src={channel?.image || imageDefault}
                />

              </div>
              <span name="channel">
                {/*Channel name */}
                <h3>{channel?.username}</h3>
                {/*channel subscriptors counter*/}
                <p>{channel?.followersCount} susbcriptors</p>
              </span>
            </Link>

            {
             isAuthorized &&
              <>
                {/*Subscribe button*/}
                <button
                  className={style.subscribeButton}
                  onClick={()=>subscribe(channel?.id)}
                  data-subscribed={isSubscribed}
                >
                  {isSubscribed ? "subcribed" : "subscribe"}
                </button>
              </>
            }

            {/*Like and Dislike buttons */}
            <div className={style.likeDislike}>
              {/*Like button*/}
                <div name="like" onClick={()=>mutateLike('like')} data-selected={isLiked}>
                  <ThumbUpAltOutlinedIcon></ThumbUpAltOutlinedIcon>
                  {video?.data?.likes}
                </div>
                <span></span>
              {/*Dislike button*/}
                <div name="dislike" onClick={()=>mutateLike('dislike')} data-selected={isDisliked}>
                  <ThumbDownOutlinedIcon></ThumbDownOutlinedIcon>
                  {video?.data?.dislikes}
                </div>
            </div>
              
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
