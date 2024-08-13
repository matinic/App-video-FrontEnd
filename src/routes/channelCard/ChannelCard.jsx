import React,{useState, useRef } from 'react'
import imageDefault from "../../assets/profile-image.png"
import style from "./ChannelCard.module.css"
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/queryHooks'
import { useSubscribe } from '../../hooks/mutationHooks'
import { createPortal } from 'react-dom'
import Subscriptors from '../subscriptors/Subscriptors'


export default function ChannelCard({data,...show}) {

const [followersModal,setFollowersModal] = useState(false)

const [modalProfileImg, setModalProfileImg] = useState(false)

const [imageFile,setImageFile] = useState()

const navigate = useNavigate()

const {data:user} = useUser()

const {mutate:mutateSubscribe} = useSubscribe()

const isSubscribed = user?.data?.subscriptions?.includes(data.id)

const loadImage = (e)=>{
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = ()=>{
        setImageFile(reader.result)
        setModalProfileImg(true)
    }
    reader.readAsDataURL(file)
}

const goToChannel = ()=>{
    navigate(`/channel/${data.username}`)
}

return (
    <span className={style.channelHeader}>

        {/*Profile image of the channel */}
        {
        show.image &&
            <span 
                className = { style.profileImage }
                data-navigate = { show.navigate }
                onClick = { show.navigate && goToChannel }
                data-editable = { show.editable }
            >
                <img
                    src = { data.image || imageDefault }
                    onClick = { show.editable && loadImage }
                />
            </span>
        }
        {
        modalProfileImg &&
            createPortal(
                <ProfileImage
                    closeModal={setModalProfileImg}
                    image={imageFile}
                    reset={resetForm}
                    username={params.username}
                />,
                document.body
            )
        }

       <span className={style.nameContainer}>
            {/*Channel's name*/}
            <h1 
                onClick = { show.navigate && goToChannel }
                data-navigate = { show.navigate }
            >
                {data.username}
            </h1>

            {/*Susbcriptors counter*/}
            {
            show.subscriptions &&
                <p
                    onClick={ ()=> setFollowersModal(prev => !prev) }
                    className={ style.followers }
                >
                    {data.followersCount} Subscriptors
                </p>
            }

            {/* Followers list modal -Show the followers list of the channel*/}
            {
            followersModal &&
                createPortal(
                    <Subscriptors closeButton = {setFollowersModal}/>,
                    document.body 
                )
            }

            {/*Suscribe button*/}
            {
            show.subscribe &&
                <button
                    onClick={()=>mutateSubscribe(data.id)}
                    data-subscribed={isSubscribed}
                >
                    {isSubscribed ? "subcribed" : "subscribe"}
                </button>
            }
        </span>
    </span> 
  )
}
