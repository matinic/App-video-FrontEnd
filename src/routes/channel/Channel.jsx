import React,{useState, useRef,useEffect } from 'react'
import style from "./Channel.module.css"
import { useUser } from '../../hooks/queryHooks'
import { useParams, Link, useNavigate, useLocation} from 'react-router-dom'
import { useChannel, useLikedVideos, useSubscriptions, useFollowers } from '../../hooks/queryHooks'
import VideoCard from '../videoCard/VideoCard'
import ChannelCard from "../channelCard/channelCard.jsx"

export default function Channel() {

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

const isChannelOwner = user?.data?.username === channel?.data?.username

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
            data = {channel?.data}
            subscribe
            title
            image
            subscribers
            subscribersModal
            editable
            large
        />

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
                ?.map( vid =>
                    <VideoCard
                        key={ vid.id }
                        data = { vid }
                        title
                        video
                        navigate
                    />
                )
            }
        </div>  

        {
        isChannelOwner &&
        <>
            <div className={style.viewsContainer} data-selected={"#unpublished" === hashRoute}>
                {
                user?.data?.videos
                    ?.filter(vid => !vid.published)
                    ?.map( vid =>
                        <VideoCard
                            key={ vid.id }
                            data = { vid }
                            title
                            navigate
                            video
                        />
                    )
                }
            </div>

            <div className={style.viewsContainer} data-selected={"#liked" === hashRoute}>
                {
                likedVideos?.data
                    ?.map( vid =>
                        <div key = {vid.id}>
                            <VideoCard
                                data = { vid }
                                navigate
                                video
                            />
                            <ChannelCard
                                data = { vid.user }
                                title
                                image
                                navigate
                                small
                                horizontal
                            >
                            <VideoCard
                                data = { vid }
                                title
                                navigate  
                            />
                            </ChannelCard>
                      </div>
                    )
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
                            subscribers
                            subscribersModal
                            navigate
                            large
                        />
                    )
                }
            </div>
        </>
        }
      
    </div>
  )
}
