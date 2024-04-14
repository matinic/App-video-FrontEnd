import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import useVideo from '../../hooks/useVideo'
import style from "./Detail.module.css"
import imageDefault from "../../assets/profile-image.png"
import { Link } from 'react-router-dom'
import useEditVideo from '../../hooks/useEditVideo'
import useUser from "../../hooks/useUser"
import useDeleteVideo from '../../hooks/useDeleteVideo';
import { createPortal } from 'react-dom';
import usePublish from '../../hooks/usePublish';
import useLikeVideo from '../../hooks/useLikeVideo';
import useSubscribe from '../../hooks/useSubscribe';
import useSubscriptions from '../../hooks/useSubscriptions';
import useLikedVideos from '../../hooks/useLikedVideos';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import SouthIcon from '@mui/icons-material/South';

export default function Detail() {

const params = useParams()

//Query that get all video information, included 
const {data:video, isError, isLoading} = useVideo(params.id)

//from the video query 
const channel = video?.data?.user

const navigate = useNavigate()

const {data:user} = useUser()

const {mutate:editVideoMutation} = useEditVideo()

const {mutate:mutateLikeVideo} = useLikeVideo()

const {mutate:subscribe} = useSubscribe()

const {data:subscriptions} = useSubscriptions()

const {data:likedVideos} = useLikedVideos()

const { mutate} = useDeleteVideo()

const {mutate:publishMutate} = usePublish()

const isSubscribed = subscriptions?.data?.map(subs => subs.id).includes(channel?.id)

const isLiked = likedVideos?.data?.map(video => video.id).includes(video?.data.id)

// const edit = ({target})=>{
//   if(target.name === 'title'){
//     setShowEditTitle(prev => !prev)
//     setVideoTitle(video?.title)
//   }
//   else if(target.name === 'description'){
//     setShowEditDescription(prev => !prev)
//     setVideoDescription(video?.description)
//   }
// }

// const confirmChanges = (e)=>{
//   e.preventDefault()
//   const name = e.target.name
//   let info = {
//     name,
//     body: {
//       id: video.data.id
//     }
//   }
//   if(name === 'title') info.body.title = videoTitle
//   else if(name === 'description') info.body.description = videoDescription
//   editVideoMutation(info,{
//     onSettled:(_a,_b,context)=>{
//       if(context.name === 'title') setShowEditTitle(false)
//       if(context.name === 'description') setShowEditDescription(false)
//     }
//   })
// }

// const deleteVideo = ()=>{
//   deleteVideoMutation(video.data.id)
// }

// const DeleteVideoModal = function(){
//   const closeModalAccept = ()=>{
//     setShowDeleteModal(false)
//     if(deleteResponse) navigate(`/channel/${user?.data.username}`)
//     resetDelete()
//   }
// return (
//     <div
//       className={style.deleteModal}
//       onClick={
//         (e)=> {
//           if(e.target === e.currentTarget){
//             closeModalAccept()
//           } 
//         }
//       }
//     >
//       <div className={style.modalContainer}>
//         <h2>Are you sure you want to delete this video?</h2>
//         {video?.data.title}
//         {
//           loadingDelete ? 
//             <h3>Deleting Video...</h3>
//           : 
//           <>
//             { 
//               isDeleteSuccess ? 
//                 <>
//                   <h3>{deleteResponse?.data?.message}</h3>
//                   <button onClick= {closeModalAccept}>Accept</button>
//                 </>
//               :
//                <>
//                  {
//                    isErrorDelete ?
//                    <>
//                     <h3>{errorDelete.response.data.message}</h3>
//                     <button onClick={()=>{
//                       resetDelete()
//                     }}>Accept</button>
//                    </>
//                    :
//                     <h3>This action cannot go back</h3>
//                  }
//                </>
//             }
//           </>
//         }
//         {
//           !isErrorDelete && !isDeleteSuccess &&
//             <span>
//               <button onClick={deleteVideo}>Yes, Delete</button>
//               <button onClick={()=>setShowDeleteModal(false)}>No, go Back</button>
//             </span>
//         }
//       </div>
//     </div>  
//   )
// }

// const modalActionsContainer = function(){
//   return (
//     <div className={style.publishModal}>
//       <h3>
//         {
//           video?.data.published ? 
//             "Video is Public now"
//             : "Video is on Private now"
//         }

//       </h3>
//     </div>
//   )
// }

const publishHandler = function(){
  const body = {
    id: video.id,
    published: !video.published
  }
  publishMutate(body)
}

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
        <video src={video?.data.url} controls className={style.videoPlayer}></video>
        
        {/*Video title*/}
        <h2 className={style.videoTitle}>{video.data.title}</h2> 

        <div className={style.channelContainer}>

          {/*Link to the main channel*/}
            <Link
              to={`/channel/${channel?.username}`}
              className={style.channel}
            >
              <img
                src={channel?.image || imageDefault}
                className={style.profileImage}
              />
              <span name="channel">
                {/*Channel name */}
                <h3>{channel?.username}</h3>
                {/*channel subscriptors counter*/}
                <p>{100} susbcriptors</p>
              </span>
            </Link>

            {/*Subscribe button*/}
            <button
              className={style.subscribeButton}
            >
              Suscribe
            </button>

            {/*Like and Dislike buttons */}
            <div className={style.likeDislike}>
              {/*Like button*/}
                <div name="like">
                  <ThumbUpAltOutlinedIcon></ThumbUpAltOutlinedIcon>
                  {video.data.likes}
                </div>
                <span></span>
              {/*Dislike button*/}
                <div name="dislike">
                  <ThumbDownOutlinedIcon></ThumbDownOutlinedIcon>
                  0
                </div>
            </div>
              
        </div>

        <pre className={style.videoDescription}>{`${video?.data.description}`}</pre>
        <p className={style.expandButton}>
          <SouthIcon style={{fontSize: 'small'}}></SouthIcon>
        </p>
    </div>
  )
}
