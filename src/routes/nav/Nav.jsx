import React,{useEffect, useRef, useState} from 'react'
import style  from './Nav.module.css'
import imageDefault from "../../assets/profile-image.png"
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useLogout } from '../../hooks/mutationHooks'
import { useUser } from '../../hooks/queryHooks'
import notificationsBellIcon from "../../assets/notifications_bell.png"
import logoutIcon from "../../assets/logout.png"

export default function Nav() {

  const {pathname} = useLocation()

  //Quey that brings all information about user asynchronous state
  const { data, isSuccess } = useUser()

  //Information got from user query
  const user = data?.data

  //Logout hook
  const { mutate:logout } = useLogout()

  //navigation hook
  const navigate = useNavigate()

  //View state of the user menu
  const [profileListView, setProfileListView] = useState("none")

  //Notification state of the notifications
  const [notificationsListView, setNotificationsListView] = useState("none")

  //Image from user profile visible on the navbar (button)
  const profileButton = useRef()

  //Menu profile buttons container (list)
  const profileList = useRef()

  //Notifications bell image icon (button)
  const notificationsButton = useRef()

  //Notifications List (list)
  const notificationsList = useRef()

 //Function that returns handlers used in the hide list actions
  const hideFunctionsFactory = (button, list, setState)=> (e)=>{
    if(
        !list.current?.contains(e.target) && //list
        e.target !== button.current && //button
        list.current //list
      ){
        setState("none")
        document.removeEventListener("click",hideFunctionsFactory(button, list, setState))
      }
  }
  const hideProfileListHandler = hideFunctionsFactory(profileButton, profileList, setProfileListView)
  const hideNotifcationsListHandler = hideFunctionsFactory(notificationsButton, notificationsList, setNotificationsListView)


  const notificationsMessages = ["New Video 1","New Video 2", "New Video 3" ]
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
        <Link
          to="/create"
          style={{postion:'relative'}}
        >
          <p className={style.button} name="upload">Upload</p>
        </Link>

        {/* Search bar */}
        <div className={style.searchBar} >
          <p className={style.searchButton}>Search</p>
          <input type="text" />
        </div>

        {
          isSuccess && <>      
             {/*Notifications Button*/}
              <img
                src={notificationsBellIcon}
                className={style.notificationsBell}
                ref={notificationsButton}
                onClick={()=>{
                    setNotificationsListView(notificationsListView === "none" ? "" : "none")
                    document.addEventListener("click", hideNotifcationsListHandler)
                  }
                }
              />

              {/*Notifications List */}
              <ul
                className={style.notificationsList}
                ref = {notificationsList}
                data-display={notificationsListView}  
              >
                  {
                    notificationsMessages.map(
                      (message,i) => <li key ={i} className={style.button}>{message}</li>
                      ).reverse()
                  }
              </ul>

              {/*User profile Button*/}
              <img
                src={ user?.image || imageDefault }
                className={style.imageProfile}
                ref={profileButton}
                onClick={ ()=> {
                  setProfileListView( profileListView === "none" ? "" : "none" )
                  document.addEventListener("click", hideProfileListHandler)
                }}
              />

              {/*User Profile buttons*/}
              <ul className={style.userProfileButtons} data-display={profileListView} ref={profileList} >
                  <li
                    className={style.button}
                    name="profile"
                    onClick=
                      { 
                        () => 
                          {
                            navigate(`/channel/${user.username}`) 
                            setProfileListView("none")
                          }
                      }
                  >
                    <img
                      src={ user?.image || imageDefault }
                      className={style.imageProfile}
                      name="imgProfileLink"
                    />
                    {user.username}
                  </li>
                  {/*Logout Button*/}
                  <li
                      className={style.button}
                      name="logout"
                      onClick={ () => logout(null,
                          {
                            onSuccess: () => {
                              navigate("/")
                              setProfileListView("none")
                            }
                          }
                        )
                      }>
                      <img src={logoutIcon} alt="" name="logout"/>
                      Log Out
                  </li>
              </ul>
            </>
        }
        {
          ( 
            !user ?
            <>
              <p onClick={()=> navigate('/signup')} name="signup" className={style.button}>Signup</p>
              <p onClick={()=> navigate('/signin')} name="signin" className={style.button}>Signin</p>
            </>
            : null 
            ) 
        }
    
      </div>
  </div>
  )
}
