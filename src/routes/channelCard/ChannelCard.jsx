import React,{useState, useEffect, useRef } from 'react'
import imageDefault from "../../assets/profile-image.png"
import style from "./ChannelCard.module.css"
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/queryHooks'
import { useSubscribe } from '../../hooks/mutationHooks'
import { createPortal } from 'react-dom'
import Subscriptors from '../subscriptors/Subscriptors'
import Editor from '../Editor/Editor'
import { useSnackBar } from '../../hooks/suztandHooks'

export default function ChannelCard({ data, children, ...show}) {

const [followersModal,setFollowersModal] = useState(false)

const [size, setSize] = useState("large")

const [imageFile, setImageFile] = useState()

const inputRef = useRef()

const navigate = useNavigate()

const {data:loggedUser} = useUser()

const {mutate:mutateSubscribe} = useSubscribe()

const isChannelOwner = loggedUser?.data?.username === data.username

const isSubscribed = loggedUser?.data?.subscriptions?.includes(data.id)

const snack = useSnackBar()

const handleSubscribe = () => {
    mutateSubscribe(data.id)
    if(isSubscribed){
        snack.setOpen("Unsubscribed")
    }else{
        snack.setOpen("Subscribed")
    }
}

const handleClose = () => {
    setImageFile(null);
    inputRef.current.value = ""
}

const goToChannel = ()=>{
    navigate(`/channel/${data.username}`)
}

const showModal = () => setFollowersModal(prev => !prev)

useEffect(()=>{
    if(show.small) setSize("small")
    if(show.large) setSize("large")
    if(show.row) setSize("row")
},[])

const loadImage = e => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = ()=>{
        setImageFile(reader.result)
    }
    reader.readAsDataURL(file)
}

const handleClick = () => {
    if(inputRef.current){
        inputRef.current.click()
    }
}

return (
    <div 
        className = { style.mainContainer }
        data-size = { size }
        data-navigate = { show.navigate }
    >
        {/*Profile image of the channel */}
        {
        show.image &&
            <span 
                className = { style.profileImage }
                onClick = { show.navigate && goToChannel }
                data-editable = {  isChannelOwner && show.editable }
            >
                <img
                    src = { data.image || imageDefault }
                    onClick = { show.editable && handleClick }
                />
            </span>
        }
        {
        !!imageFile && <Editor onClose={handleClose} image={imageFile}></Editor>
        }
        <input
            type="file"
            ref={inputRef}
            onChange={loadImage}
            style={{display: "none"}}
            accept=".png,.jpg,.jpeg" 
        />
        <div
            className = { style.nameContainer }
        >
            {/*Whatever is necesary to introduce in the component*/}
            { children }
            {/*Channel's name*/}
            <div>
                {
                show.name && 
                    <h1
                        onClick = { show.navigate && goToChannel } 
                    >
                        { data.username }
                    </h1>
                }

                {/*Susbcriptors counter*/}
                {
                show.subscribers &&
                    <p
                        onClick={ show.subscribersModal && showModal }
                        className={ show.subscribersModal && style.subscribers }
                    >
                        { data.followersCount } subscribers
                    </p>
                }

                {/* Followers list modal -Show the followers list of the channel*/}
                {
                followersModal &&
                    createPortal
                    (
                    < Subscriptors
                        closeButton = { setFollowersModal }
                    />,
                    document.body 
                    )
                }
            </div>
            {/*Suscribe button*/}
            {
            show.subscribe && !isChannelOwner &&
                <button
                    onClick = { handleSubscribe }
                    data-subscribed = { isSubscribed }
                >
                    { isSubscribed ? "subcribed" : "subscribe" }
                </button>
            }
        </div>
    </div> 
  )
}
