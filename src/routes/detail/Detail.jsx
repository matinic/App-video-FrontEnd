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

export default function Detail() {
    
const params = useParams()

const navigate = useNavigate()

const {data:user} = useUser()

const {mutate:editVideoMutation} = useEditVideo()

const {mutate:mutateLikeVideo} = useLikeVideo()

const {mutate:subscribeMutation} = useSubscribe()

const {data:subscriptions} = useSubscriptions('subscriptions')

const {data:likedVideos} = useLikedVideos()

const {
  mutate:deleteVideoMutation,
  isLoading:loadingDelete,
  data:deleteResponse,
  isError:isErrorDelete,
  error:errorDelete,
  isSuccess:isDeleteSuccess,
  reset:resetDelete
} = useDeleteVideo()

const {mutate:publishMutate} = usePublish()

const {data:video, isError, isLoading} = useVideo(params.id)

const channel = video?.data.user

const isUserAllowed = user?.data.username === channel?.username

const [showEditTitle, setShowEditTitle] = useState(false)

const [showEditDescription, setShowEditDescription] = useState(false)

const [videoTitle,setVideoTitle] = useState('')

const [videoDescription,setVideoDescription] = useState('')

const [showDeleteModal,setShowDeleteModal] = useState(false)

const isSubscribed = subscriptions?.data?.map(subs => subs.id).includes(channel?.id)

const isLiked = likedVideos?.data?.map(video => video.id).includes(video?.data.id)

const edit = ({target})=>{
  if(target.name === 'title'){
    setShowEditTitle(prev => !prev)
    setVideoTitle(video?.title)
  }
  else if(target.name === 'description'){
    setShowEditDescription(prev => !prev)
    setVideoDescription(video?.description)
  }
}

const confirmChanges = (e)=>{
  e.preventDefault()
  const name = e.target.name
  let info = {
    name,
    body: {
      id: video.data.id
    }
  }
  if(name === 'title') info.body.title = videoTitle
  else if(name === 'description') info.body.description = videoDescription
  editVideoMutation(info,{
    onSettled:(_a,_b,context)=>{
      if(context.name === 'title') setShowEditTitle(false)
      if(context.name === 'description') setShowEditDescription(false)
    }
  })
}

const deleteVideo = ()=>{
  deleteVideoMutation(video.data.id)
}

const DeleteVideoModal = function(){
  const closeModalAccept = ()=>{
    setShowDeleteModal(false)
    if(deleteResponse) navigate(`/channel/${user?.data.username}`)
    resetDelete()
  }
return (
    <div
      className={style.deleteModal}
      onClick={
        (e)=> {
          if(e.target === e.currentTarget){
            closeModalAccept()
          } 
        }
      }
    >
      <div className={style.modalContainer}>
        <h2>Are you sure you want to delete this video?</h2>
        {video?.data.title}
        {
          loadingDelete ? 
            <h3>Deleting Video...</h3>
          : 
          <>
            { 
              isDeleteSuccess ? 
                <>
                  <h3>{deleteResponse?.data?.message}</h3>
                  <button onClick= {closeModalAccept}>Accept</button>
                </>
              :
               <>
                 {
                   isErrorDelete ?
                   <>
                    <h3>{errorDelete.response.data.message}</h3>
                    <button onClick={()=>{
                      resetDelete()
                    }}>Accept</button>
                   </>
                   :
                    <h3>This action cannot go back</h3>
                 }
               </>
            }
          </>
        }
        {
          !isErrorDelete && !isDeleteSuccess &&
            <span>
              <button onClick={deleteVideo}>Yes, Delete</button>
              <button onClick={()=>setShowDeleteModal(false)}>No, go Back</button>
            </span>
        }
      </div>
    </div>  
  )
}

const modalActionsContainer = function(){
  return (
    <div className={style.publishModal}>
      <h3>
        {
          video?.data.published ? 
            "Video is Public now"
            : "Video is on Private now"
        }

      </h3>
    </div>
  )
}

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
    <h2>Something went wrong</h2>
)
return (
    <div>
        <video src={video?.data.url} controls className={style.videoPlayer}></video>
        {
          isUserAllowed ?
            <>
              <button onClick={()=>setShowDeleteModal(true)}>Delete Video</button> 
              <button onClick={publishHandler}>
                  {
                    video?.data.published ? 
                      "Unpublish Video"
                    : "Publish Video"
                  }
                </button>
              {
                showDeleteModal && createPortal(<DeleteVideoModal/>,document.body)
              }
            </>
          : null 
        }
        <span className={style.titleContainer}>
          {
            showEditTitle ?
              <>
                <h1>{videoTitle}</h1>
                <button name="title" onClick={confirmChanges} >Confirm</button>
                <button onClick={()=>{setShowEditTitle(false)}}>Cancel</button>
                <input type="text" value={videoTitle} className={style.editInput} onChange={({target})=>{setVideoTitle(target.value)}}/>
              </>
            : 
              <>
                <h1>{video?.data.title}</h1>
                { isUserAllowed ? <button onClick={edit} className={style.editButton} name="title">Edit</button> : null }
              </>
          }
        </span>
        <div className={style.channelContainer}>

            <Link to={`/channel/${channel?.username}`} className={style.linkChannel}>
              <img src={channel?.image || imageDefault} className={style.channelImage}/>
              <h3>{channel?.username}</h3>
            </Link>

            <h3>{channel?.channelFollowers?.length}</h3>
             
            <button
              disabled={isUserAllowed}
              onClick={()=>subscribeMutation(channel?.id)}
              style={ isSubscribed ? {backgroundColor: 'green', color: 'white'} : {backgroundColor: 'red', color: 'black'} } >
              {isSubscribed ? "Subscribed" : "Subcribe" }
            </button>
            <h3>{channel?.followersCount}</h3>
                
            {
              <>
                <button disabled={isUserAllowed} onClick={ () => mutateLikeVideo(video?.data.id)} style={ isLiked ? {backgroundColor: 'green', color:'white'} : {backgroundColor: 'red', color: 'black'} }>
                  {isLiked ? "you like this" : "like"}
                </button>
                <h3>{video?.data.likes}</h3>
              </>
            }
        </div>

       {
        showEditDescription ?
          <>
              <textarea onChange={({target})=>{setVideoDescription(target.value)}} value={videoDescription}></textarea>
              <button onClick={confirmChanges} name="description">Confirm</button>
              <button onClick={()=>{setShowEditDescription(prev => !prev)}}>Cancel</button>
          </>
         :
          <>
            <pre>{`${video?.data.description}`}</pre>
            {
              isUserAllowed ?
                <button onClick={edit} name='description'>Edit</button>
              : null
            }
          </>
       }
    </div>
  )
}
