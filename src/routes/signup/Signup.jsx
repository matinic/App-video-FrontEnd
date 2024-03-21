import React,{ useEffect, useState, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import useSignup from "../../hooks/useSignup"
import style from  "./Signup.module.css" 

export default function Signup() {

const navigate = useNavigate()

const {mutate:submitForm,isLoading:isSubmitingFrom} = useSignup()

const form = useRef({
    username: "",
    email: "",
    password: "",
    passwordMatch: "",
    emailMatch: "",
})

const [error,setError] = useState({})

const formHandler = (e)=>{
    form.current = {
            ...form.current,
            [e.target.name] : e.target.value
        }
   setError(errorHandler(form.current))
}

useEffect(()=>{
    setError(errorHandler(form.current))
},[])

const errorHandler = (validate)=>{
    //username related errors
        let error = {}
        const exp = /^[a-zA-Z0-9]+$/
        const emailExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const {username,email,password,passwordMatch,emailMatch} = validate
   
        //username validation  
        error.username = []
        if( username.length > 16 || username.length < 4 ) error.username.push(`Username length must be between 3 and 16 characters  `)
        if( !exp.test(username) ) error.username.push(` Only numbers and letters are allowed`)
        if(!error.username.length) delete error.username 

        //email validation
        if( !emailExp.test(email) ) error.email = 'Invalid email'
        if( !email ) error.email = 'Introduce email'

        //emailMatch 
        if( emailMatch !== email ) error.emailMatch = 'Email do not match'
        if( !emailMatch ) error.emailMatch = 'Repeat email'
        
        //password validation
        if(password.length > 16 || password.length < 8) error.password = `Introduce a password between 8 and 16 characters`
        
        //passwordMatch
        if( passwordMatch !== password ) error.passwordMatch = 'Password do not match'
        if( !passwordMatch ) error.passwordMatch= 'Repeat password'

        return error
    }

const submitHandler = (e)=>{
    e.preventDefault()
    const errors = errorHandler(form.current)
    if(Object.keys(errors).length){
        alert("Complete fieds")
    }else{
        submitForm(form.current,{
            onSuccess: ()=>{
                alert("Signup successfull")
            },
            onError: (err)=>{
                alert("Something went wrong: " + "\n" + err.response.data.message)
            }
        })
    }
}

  return (
        <form onSubmit={submitHandler}>

        <fieldset className='form' class={style.form}>

            <legend>Signup</legend>

            <label >Username</label>
            <input type="text" value={form.username} onChange={formHandler} name='username'/>
            {error?.username && error?.username?.map(err => <li class={style.error}>{err}</li>)}
            
            <label>Email</label>
            <input type="text" name="email" onChange={formHandler} value={form.email}/>
            {error?.email && <li class={style.error}>{error?.email}</li>}

            <label>Email</label>
            <input type="text" onChange = {formHandler} name="emailMatch" value={form.emailMatch}/>
            {error?.emailMatch && <li class={style.error}>{error?.emailMatch}</li>}

            <label >Password</label>
            <input type="text" name="password" onChange={formHandler} value={form.password}/>
            {error?.password && <li class={style.error}>{error?.password}</li>}

            <label>Password</label>
            <input onChange = {formHandler} name="passwordMatch" type="text" value={form.passwordMatch} />
            {error?.passwordMatch && <li class={style.error}>{error?.passwordMatch}</li>}

            <button type="submit" class={style.button}>send</button>

        </fieldset>

        <h3>{isSubmitingFrom && "Sending Form"}</h3>
        
    </form>   
  )
}
