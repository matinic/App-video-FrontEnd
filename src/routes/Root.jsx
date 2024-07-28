import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "./nav/Nav";
import Videos from "./videos/Videos";
import React from 'react'


export default function Root() {


  const {pathname} = useLocation()


    return (
      <div>
        
        <Nav/>
        {
          pathname === "/" ?
          <Videos/>:null
        }
        <Outlet/>
        
      </div>
    )
  
  }