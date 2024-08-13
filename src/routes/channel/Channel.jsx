import React,{useState, useRef,useEffect } from 'react'
import imageDefault from "../../assets/profile-image.png"
import style from "./Channel.module.css"
import { useUser } from '../../hooks/queryHooks'
import { useParams, Link, useNavigate, useLocation} from 'react-router-dom'
import { useChannel, useLikedVideos, useSubscriptions, useFollowers } from '../../hooks/queryHooks'
import { useSubscribe } from '../../hooks/mutationHooks'
import { createPortal } from 'react-dom'
import ProfileImage from '../profileImage/ProfileImage'
import Subscriptors from '../subscriptors/Subscriptors'
import VideoCard from '../videoCard/VideoCard'
import ChannelCard from "../channelCard/ChannelCard.jsx"

export default function Channel() {

const [followersModal,setFollowersModal] = useState(false)

const menu = useRef()

const navigate = useNavigate()

const params = useParams()

const {hash:hashRoute} = useLocation()
//Logged In User profile
const {data:user} = useUser()
//const {data:logged} = useUserLogged()

//Public User profile
const {data:channel, isError:channelError, isLoading:channelLoading, isSuccess:channelSuccess} = useChannel(params.username)
//const {data:public} = useUserPublic

const {data:likedVideos} = useLikedVideos()

const {data:subscriptions} = useSubscriptions()

const {data:followers} = useFollowers(params.username)

const {mutate:subscribe} = useSubscribe()

const isChannelOwner = user?.data?.username === channel?.data?.username

const formImage = useRef()

useEffect(()=>{
   const allowedRoutes = ["#public","#unpublished","#liked","#subscriptions"]
    if(!hashRoute){
        navigate("#public",{replace: true})
    }
    if( isChannelOwner && allowedRoutes.includes(hashRoute)){
        navigate(hashRoute,{replace: true})
    }
    else {
        navigate("#public",{replace: true})
    }

},[hashRoute])

if(channelLoading) return (<h3 className={style.channelContainer}>Loading...</h3>)

if(channelError) return (<p className={style.channelContainer}>NOT FOUND 404 <Link to="/">return home</Link> </p>)

if(channelSuccess) return (
    <div className={style.channelContainer}>

        {/*Profile image of the channel */}
        <ChannelCard
            key = {channel?.data?.id}
            data = {channel?.data}
            subscribe = {!isChannelOwner}
            title
            image
            subscriptions
            editable
        ></ChannelCard>

        {/* Menu showing videos ana channel subscriptions*/}
        <ul className={style.channelMenu} ref={menu}>
            <Link to={"#public"} data-selected={"#public" === hashRoute}>
                Videos 
            </Link>
            {/*Logged In user visible button*/}
            {
            isChannelOwner &&  
            <>
                <Link to={"#unpublished"} data-selected={"#unpublished" === hashRoute}>
                    Unpublished 
                </Link>

                <Link to={"#liked"} data-selected={"#liked" === hashRoute}>
                    Liked 
                </Link>

                <Link to={"#subscriptions"} data-selected={"#subscriptions" === hashRoute}>
                    Subscriptions
                </Link>
            </>
            }
        </ul>

        <div className={style.viewsContainer} data-selected={"#public" === hashRoute}>
            {
            channel?.data?.videos
                ?.filter(vid => vid.published)
                ?.map(vid => <VideoCard video={vid} key={vid.id}/>)
            }
        </div>  

        {
        isChannelOwner &&
        <>
            <div className={style.viewsContainer} data-selected={"#unpublished" === hashRoute}>
                {
                user?.data?.videos
                    ?.filter(vid => !vid.published)
                    ?.map(vid => <VideoCard video={vid} key={vid.id}/>)
                }
            </div>

            <div className={style.viewsContainer} data-selected={"#liked" === hashRoute}>
                {
                likedVideos?.data
                    ?.map(vid => <VideoCard showData video={vid} key={vid.id}/>)
                }
            </div>

            <div className={style.viewsContainer} data-selected={"#subscriptions" === hashRoute}>
                {
                subscriptions?.data
                    ?.map(channel =>
                           <ChannelCard
                            key = {channel.id}
                            data = {channel}
                            subscribe
                            title
                            image
                            subscriptions
                            navigate
                           ></ChannelCard>
                    )
                }
            </div>
        </>
        }
      
    </div>
  )
}
