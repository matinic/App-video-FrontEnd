import React, { useEffect, useState } from 'react'
import { Box, Button, Divider, Stack, Typography } from '@mui/material'
import ChannelCard from '../channelCard/ChannelCard'
import { useFollowers } from '../../hooks/queryHooks';
import { useLocation } from 'react-router-dom';
import GenericModal from "../genericModal/GenericModal"
import CloseIcon from '@mui/icons-material/Close';

export default function Followers({username,open,onClose}) {

const {pathname} = useLocation()

const [change,setChange] = useState()

useEffect(() => {
    if(!change){
        setChange(true)
    }else{
        onClose()
    }
},[pathname])

const {data} = useFollowers(username)

  return (
    <GenericModal
        onClose = {onClose}
        open = {open}
        flexDirection= "column"
        display = "flex"
        gap = {2}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: "space-between",
                gap:"30px",
              }}
        >
            <Stack     
                sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: "space-between",
                    gap:"30px"
                }}
            >
            <Typography
                variant='h4'
                sx={{color: "white", margin:"0px"}}
                gutterBottom
            >
                {username}
            </Typography>
            <Typography
                variant='subtitle2'
                sx={{color: "white", margin:"0px"}}
                gutterBottom
            >
                {data?.data?.length} Followers
            </Typography>
            </Stack>
      
            <Button onClick={onClose}><CloseIcon></CloseIcon></Button>
        </Box>
        <Divider variant="middle" flexItem sx={{margin:"0px",padding:"0px", border: "1px solid"}}></Divider>
        <Box sx={{display:"flex", gap:"10px", flexDirection:"column", overflowY : "auto", maxHeight: "400px"}} >
            {
                data?.data?.map( user =>
                    <ChannelCard
                        key = { user.id }
                        data = { user }
                        image
                        navigate
                        name
                        size="row"
                    />
                )
            }
        </Box>
    </GenericModal>
  )
}
