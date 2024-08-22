import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import style from "./editVideoButtons.module.css"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import DeleteIcon from '@mui/icons-material/Delete';
import { Portal } from '@mui/material';
import * as mutate from "../../hooks/mutationHooks"
import { useNavigate } from 'react-router-dom';
import Edit from '../edit/Edit';
import { useSnackBar } from '../../hooks/suztandHooks';
export default function EditVideoButtons({data,...show}) {
    
const { mutate:publish } = mutate.usePublish( data.id )

const { mutate:mutateDelete } = mutate.useDeleteVideo( data.id )

const { setOpen } = useSnackBar()

const navigate = useNavigate()

const [showEditVideo,setShowEditVideo] = React.useState(false)

const deleteHandler = ()=>{
    const deleteVideo = confirm("Warning: Do you want to delete the video?")
    if(deleteVideo){
        mutateDelete(data.id,{
            onSuccess: () => {
                setOpen("Video Deleted")
                navigate("/")
            },
        })
    }
  }
const handlePublish = () => {
    if(data.published){
        const hideVideo = confirm("Warning: Do you want to hide this video?")
        if(hideVideo){
            publish( false, {
                    onSuccess : () => setOpen("The video is now hidden")
                }
            )
        }
    }else{
        publish( true, {
                onSuccess : () => setOpen("The video is now public")
            }
        )
    }
}

return (
    <div className = { style.videoOptions }>
        {
        show.edit && 
            <button 
                className={ style.edit } 
                onClick={ () => setShowEditVideo( !showEditVideo ) }
                title={"Edit"}
            >
                <EditIcon fontSize='medium'/>
            </button>
        }
        {
        showEditVideo && 
            <Portal children = { 
                    <Edit 
                        close ={ setShowEditVideo }
                        videoInfo = { data }
                        isOpen = { showEditVideo }
                    />
                }
            />
        }
        {
        show.hide && 
            <button 
                onClick = { handlePublish }
                data-published = { !data.published }
                title = { data.published  ? "Hide Video" : "Show Video" }
            >
                {
                    data.published 
                    ? 
                        <VisibilityOffIcon fontSize='medium'/>
                    :
                        <VisibilityIcon fontSize='medium'/>
                }
            </button>
        }
        {
        show.delete &&
            <button 
                onClick = { deleteHandler } 
                title = { "Delete Video" } 
            >
                <DeleteIcon fontSize='medium'/>
            </button>
        }
    </div>
  )
}
