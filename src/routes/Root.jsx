import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "./nav/Nav";
import Videos from "./videos/Videos";
import React from 'react'
import { Snackbar } from "@mui/material";
import { useSnackBar } from "../hooks/suztandHooks";

export default function Root() {

  const {pathname} = useLocation()

  const { message, open, setClose } = useSnackBar()

    return (
      <>
        
        <Nav/>
        <Snackbar
          open={open}
          autoHideDuration={500}
          onClose={setClose}
          message={message}
        ></Snackbar>
        {
          pathname === "/" ?
          <Videos/>:null
        }
        <Outlet/>
        
      </>
    )
  
  }