import React,{useState, useRef, useEffect} from 'react'
import imageDefault from "../../assets/profile-image.png"
import style from "./Channel.module.css"
import useUser from '../../hooks/useUser'
import VideoCard from '../videoCard/VideoCard'
import { useParams, Link } from 'react-router-dom'
import useChannel from '../../hooks/useChannel'
import useLikedVideos from '../../hooks/useLikedVideos'
import useSubscriptions from '../../hooks/useSubscriptions'
import useSubscribe from '../../hooks/useSubscribe'
import Subscriptors from '../subscriptors/Subscriptors' 
import { createPortal } from 'react-dom'
import ProfileImage from '../profileImage/ProfileImage'

export default function Channel() {

    const [followersModal,setFollowersModal] = useState(false)

    const [modalProfileImg, setModalProfileImg] = useState(false)

    const params = useParams()

    const {data:channel} = useChannel(params.username)
    
    const {mutate:subscribe} = useSubscribe()

    const channelInfo = channel?.data

    const {data:user} = useUser()

    const userLogged = user?.data

    const {data:likedVideos} = useLikedVideos()

    const {data:subscriptions} = useSubscriptions('subscriptions')
    
    const {data:followers} = useSubscriptions('followers')

    const isSubscribed = subscriptions?.data.map(subs => subs.id).includes(channelInfo?.id)

    const unpublishedVideos = userLogged?.videos?.filter(video => video?.published === false)

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
        <span className={style.profileChannel}>
            {/*Profile image of the channel */}
            <img
                src={channelInfo?.image || imageDefault}
                className={style.profileImage}
                onClick={channelInfo?.username === userLogged?.username ? () => inputFile.current.click() : null}
            />

            {/*This input load the image file when the user want to edit their profile image */}
            <form onChange={loadImage} ref={formImage} style={{display: 'none'}}>
                <input type="file" ref={inputFile}  />
            </form>
            <span className={style.nameContainer}>
                {/*Channel's name*/}
                <h1>{channelInfo?.username}</h1>
                {/*Susbcriptors counter*/}
                <p
                    onClick={ ()=> setFollowersModal(prev => !prev) }
                >
                    {channelInfo?.followersCount} Subscriptors
                </p>
                {/*Suscribe button*/}
                <button>
                    Subscribe
                </button>
            </span>
        </span>   

        {
        /*Edit profile photo modal
            -It opens when the user does a click on their profile photo. The editor has the functinality to crop and scale a photo that the user upload from their pc, when the user accepts the image is uploaded to the api an if the action is successfull the state of the user is updated
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

        {/* Channel Videos */}

        <h3>{channel?.data.videos.length} Videos </h3>
        <div className={style.channelVideos}>
            {
                channelInfo?.videos.map((video,i) => <VideoCard video = {video} key={i} showData={false}/>)
            }
        </div>
        <hr />
        {/* //Channel Private info */}
        {
        channelInfo?.username === userLogged?.username ? 
            <>
                {/* //Unpublished Videos */}
                <h3>Unpublished Videos ({unpublishedVideos?.length})</h3>
                <div className={style.channelVideos}>
                    { unpublishedVideos?.map((video,i) => <VideoCard key={i} video = {video} showData={false}/>) }
                </div>
                <hr />

                {/* //Liked Videos */}
                <h3>Liked Videos ({likedVideos?.data?.length})</h3>
                <div className={style.channelVideos}>
                    { likedVideos?.data?.map((liked,i) => <VideoCard key={i} video = {liked} showData={true} userChannel={userLogged?.subscriptions}/>) }
                </div>
                <hr />

                {/* //Channels suncriptions */}
                <h3>Channels Following ({subscriptions?.data?.length})</h3>
                <div className={style.channelVideos}>
                    {
                        subscriptions?.data?.map((subs,i) => {
                            return (
                                <Link key={i} to={`/channel/${subs.username}`}>
                                    <img src={subs?.image || imageDefault} className={style.profileImage} />
                                    <h3>{subs.username}</h3>     
                                </Link>
                            )
                        })
                    }
                </div>
                {/* Followers list */}
                {
                    followersModal && createPortal(<Subscriptors closeButton={setFollowersModal} followers={followers.data}/>,document.body)
                }
                   
            </>
            : null

        }
    </div>
  )
}
