import { Outlet, useLocation } from "react-router-dom";
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
          autoHideDuration={1000}
          onClose={setClose}
          message={message}
        />
        {
          pathname === "/" ?
          <Videos/>:null
        }
        <Outlet/>
        
      </>
    )
  
  }