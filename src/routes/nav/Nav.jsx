import React,{useRef, useState, useEffect, useMemo} from 'react'
import style  from './Nav.module.css'
import { useNavigate } from 'react-router-dom'
import { useUser, useGetNotifications, useNotificationsCounter } from '../../hooks/queryHooks'
import { useLogout, useUpdateNotification } from "../../hooks/mutationHooks"
import { Portal } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import ChannelCard from '../channelCard/channelCard'
import LogoutIcon from '@mui/icons-material/Logout';
import Notification from '../notification/Notification'

export default function Nav() {

//navigation hook
const navigate = useNavigate()

//Quey that brings all information about user?.data asynchronous state
const { data:user, isSuccess } = useUser()

const { mutate:logout } = useLogout(navigate)

const notificationsRef = useRef()

const notiListRef = useRef()

const profileRef = useRef()

const [open,setOpen] = useState({
  notifications: false,
  profile: false
})

const { data:notifications, fetchNextPage } = useGetNotifications()

const { mutate:updateNotification } = useUpdateNotification()

const { data:counter } = useNotificationsCounter()

useEffect(()=>{
  if(open.notifications){
    updateNotification()
  }
},[open.notifications])

const scrollNotiHandler = event =>{
  const notiListHeight = notiListRef.current.scrollHeight
  const notiList = notiListRef.current.clientHeight
  const scrollTop = notiListRef.current.scrollTop
  if(scrollTop + notiList >= notiListHeight){
    fetchNextPage()
  }
}


const showController = (option,target) =>{
  setOpen(prev => {
    const names = Object.keys(prev)
    let close = {}
    names.forEach( name => {
      if(name !== target) close[name] = false
    })
    return {
        ...close,
        [target]: option
      }
    }
  )
}

const showHandler = event => {
  event.stopPropagation()
  const target = event.currentTarget.getAttribute("data-name")
  if(!open[target]){
    showController(true,target)
    document.addEventListener("click",()=>showController(false,target))
  }else{
    showController(false,target)
    document.removeEventListener("click",()=>showController())
  }
}

return (
  <div className= {style.nav} >

    {/*Website Name*/}
    <h1
      className={style.title}
      onClick={()=>navigate("/")}
    >
      MyVid
    </h1>

    {/*Nav buttons container */}
    <div className={style.navButtonsContainer}>     
        
      {/*Upload nav button*/}
  
      <p
        className={style.upload}
        name="upload"
        onClick={()=>navigate("/create")}
      >
        Upload
      </p>

      {/* Search bar */}
      <div className={style.searchBar} >
        <p className={style.searchButton}>Search</p>
        <input type="text" />
      </div>

      {
        isSuccess && <>      
            {/*Notifications Button*/}
            <span
              onClick={showHandler}
              data-name = "notifications"
              ref={notificationsRef}
              style={{cursor:"pointer", position: "relative"}}
            >
              <Badge badgeContent={counter?.data?.count || 0} color="error">
                  <NotificationsIcon fontSize='medium'/>
              </Badge>
            </span>
            {
            open.notifications &&
              <Portal container={notificationsRef.current}>
                <ul
                  className={style.floatMenu}
                  ref={notiListRef}
                  onScroll={scrollNotiHandler}>
                  {
                  notifications.pages?.map(page => 
                    page.data.notifications?.map( noti => 
                      <Notification key={noti.id} data={noti}/>
                    ))
                  }
                </ul>
              </Portal>
            }

            {/*user?.data profile Button*/}
            <span
              style={{position: "relative"}}
              onClick = {showHandler}
              data-name = "profile"
              ref={profileRef}
            >
              <ChannelCard 
                data={user.data}
                image
                size = "small"
                sx = {{cursor: "pointer"}}
                clean
              />
            </span>
            {
            open.profile &&
                <Portal container={profileRef.current}>
                  <ul className={style.floatMenu} >
                      <li className={style.button}>
                        <ChannelCard data={user.data} image name size="small" navigate/>
                      </li>
                      {/*Logout Button*/}
                      <li
                        className = { style.button }
                        onClick = { ()=>logout() }
                        style={{display: "flex", alignItems: "center", justifyContent:"center", gap:"10px"}}
                      >
                        <LogoutIcon />
                        Log Out
                      </li>
                  </ul>
                </Portal>
            }
          </>
      }
      {
        ( 
        !user?.data &&
          <>
            <p onClick={()=> navigate('/signup')} style={{cursor:"pointer"}}>Signup</p>
            <p onClick={()=> navigate('/signin')} style={{cursor:"pointer"}}>Login</p>
          </>
        ) 
      }
  
    </div>
</div>
)}
