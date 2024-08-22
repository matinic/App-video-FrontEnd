import React from 'react'
import { useLikeVideo } from '../../hooks/mutationHooks'
import { useUser } from '../../hooks/queryHooks'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import style from "./LikesBar.module.css"

export default function LikesBar({data,...show}) {

const {data:loggedUser} = useUser()

const {mutate:mutateLike} = useLikeVideo(data.id)

const isLiked = loggedUser?.data?.likedVideos.includes(data.id)

const isDisliked = loggedUser?.data?.dislikedVideos.includes(data.id)

const suztand = {}

return (
<div
    className = { style.likeDislike }
    data-small = { show.small } 
> 
    {/*Like button*/}
    {
    show.like &&
        <div 
            onClick={()=>mutateLike('like')}
            data-selected={isLiked}
        >
            <ThumbUpAltOutlinedIcon fontSize={show.small && "small"}/>
            {
            show.counter && data.likes
            }
        </div>
    }
    {/*Dislike button*/}
    {
    show.dislike &&
        <div
            onClick={()=>mutateLike('dislike')}
            data-selected={isDisliked}
        >
            <ThumbDownOutlinedIcon fontSize={show.small && "small"}/>
            {
            show.counter && data.dislikes
            }
        </div>
    }
</div>
)
}
