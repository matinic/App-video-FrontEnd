import React,{useState, useRef } from 'react'
import imageDefault from "../../assets/profile-image.png"
import style from "./Channel.module.css"
import { useUser } from '../../hooks/queryHooks'
import VideoCard from '../videoCard/VideoCard'
import { useParams, Link } from 'react-router-dom'
import
{ 
    useChannel,
    useLikedVideos,
    useSubscriptions,
    useFollowers
} from '../../hooks/queryHooks'
import {
    useSubscribe
} from '../../hooks/mutationHooks'
import Subscriptors from '../subscriptors/Subscriptors' 
import { createPortal } from 'react-dom'
import ProfileImage from '../profileImage/ProfileImage'

export default function Channel() {

    const [followersModal,setFollowersModal] = useState(false)

    const [modalProfileImg, setModalProfileImg] = useState(false)

    {/*State of "selected* option on the video's menu*/}
    const [channelMenu,setChannelmenu] = useState("videos")

    {/*Handler for the "selected" option on the menu in the channel*/}
    const selectedOption = (e)=>{
        const name = e.target.getAttribute("name")
        setChannelmenu(name)
    }

    //Access to defined param in the browser url
    const params = useParams()

    //Logged In User profile
    const {data:user} = useUser()
    //const {data:logged} = useUserLogged()

    //Public User profile
    const {data:channel} = useChannel(params.username)
    //const {data:public} = useUserPublic

    const {data:likedVideos} = useLikedVideos()
    
    const {data:subscriptions} = useSubscriptions()
    
    const {data:followers} = useFollowers(params.username)
    
    const {mutate:subscribe} = useSubscribe()

    const isSubscribed = user?.data?.subscriptions?.includes(channel?.data?.id) 

    const unpublishedVideos = user?.data?.videos?.filter(video => video?.published === false)

    const inputFile = useRef({
        img: '',
        width: null,
        height: null,
    })

    const formImage = useRef()

    const [imageFile,setImageFile] = useState()

    const loadImage = (e)=>{
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = ()=>{
            setImageFile(reader.result)
            setModalProfileImg(true)
 
        }
        reader.readAsDataURL(file)
    }

   const resetForm = ()=>{
        formImage.current.reset()
   }


  return (
    <div className={style.channelContainer}>

        {/*User profile header*/}
        <span className={style.channelHeader}>
            {/*Profile image of the channel */}
            <img
                src={channel?.data?.image || imageDefault}
                className={style.profileImage}
                onClick={channel?.data?.username === user?.data?.username ? () => inputFile.current.click() : null}
            />

            {/*This input load the image file when the user want to edit their profile image */}
            <form onChange={loadImage} ref={formImage} style={{display: 'none'}}>
                <input type="file" ref={inputFile}  />
            </form>
            <span className={style.nameContainer}>
                {/*Channel's name*/}
                <h1>{channel?.data?.username}</h1>
                {/*Susbcriptors counter*/}
                <p
                    onClick={ ()=> setFollowersModal(prev => !prev) }
                >
                    {channel?.data?.followersCount} Subscriptors
                </p>
                {/* Followers list modal
                    -Show the followers list of the channel
                */}
                {
                    followersModal && createPortal
                        (
                            <Subscriptors closeButton={setFollowersModal} followers={followers?.data}/>,document.body
                        )
                }
                {/*Suscribe button*/}
                {
                    user?.data?.username !== channel?.data?.username &&
                    <button
                    onClick={()=>subscribe(channel?.data?.id)}
                    data-subscribed={isSubscribed}
                  >
                    {isSubscribed ? "subcribed" : "subscribe"}
                  </button>
                }
            </span>
        </span>   

        {
        /*Edit profile photo modal
            -It opens when the user does a click on their profile photo. The editor has the functinality to crop and scale a photo that the user upload from their pc, when the user accepts the image is uploaded to the api and if the action is successfull the state of the user is updated on the server and the client side
        */
        }
        {  
            modalProfileImg && createPortal
            (
                <ProfileImage
                    closeModal={setModalProfileImg}
                    image={imageFile}
                    reset={resetForm()}
                    setImageFile={setImageFile}
                    usernameChannel={params.username}
                />
                ,document.body
            )
        }

        {/* Menu showing videos ana channel subscriptions*/}
        <ul className={style.channelMenu} onClick={selectedOption}>
            <li name="videos" data-selected={channelMenu === "videos"}>
                Videos ({channel?.data?.videos?.length || 0}) 
            </li>

            {/*Logged In user visible button*/}
            {
                user?.data?.username === channel?.data?.username &&
                <>
                    <li name="unpublished" data-selected={channelMenu === "unpublished"}>
                        Unpublished ({unpublishedVideos?.length})
                    </li>

                    <li name="liked" data-selected={channelMenu === "liked"}>
                        Liked ({likedVideos?.data?.length})
                    </li>

                    <li name="subscriptions" data-selected={channelMenu === "subscriptions"}>
                        Subscriptions ({subscriptions?.data?.length})
                    </li>
                </>
            }
        </ul>

        {/*Grid that contains all the videos visible on the channel included the visualization of the channel subscriptions*/}
        
        {/*Videos uploaded to the channel and are public*/}
        <div className={style.viewsContainer} data-display={channelMenu === "videos"}>
            {
                channel?.data?.videos?.map
                    (
                        (video,i) => 
                            <VideoCard
                                video = {video}
                                key={i}
                                showData={false}
                            />
                    )
            }
        </div>
        
        {/*Unpublished Videos (private)*/}
        {
            user?.data?.username === channel?.data?.username &&
            <div className={style.viewsContainer} data-display={channelMenu === "unpublished"}>
                { unpublishedVideos?.map((video,i) => <VideoCard key={i} video = {video} showData={false}/>) }
            </div>
        }
                
        {/*Liked Videos */}
        <div className={style.viewsContainer} data-display={channelMenu === "liked"}>
            { likedVideos?.data?.map((liked,i) => <VideoCard key={i} video = {liked} showData={true} userChannel={user?.data?.subscriptions}/>) }
        </div>
                 
        {/*Channels subscriptions*/}
        <div className={style.viewsContainer} data-display={channelMenu === "subscriptions"}>
            {
                subscriptions?.data?.map((subs,i) => {
                    return (
                        <Link key={i} to={`/channel/${subs.username}`} onClick={()=>setChannelmenu('videos')}>
                            <img
                                src={subs?.image || imageDefault}
                                className={style.profileImage}
                            />
                            <h3>{subs.username}</h3>     
                        </Link>
                    )
                })
            }
        </div>
                
    </div>
  )
}
