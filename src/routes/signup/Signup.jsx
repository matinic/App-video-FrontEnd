import React,{ useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import useUser from '../../hooks/useUser'
import useSignup from "../../hooks/useSignup"
import useCloudinarySignature from "../../hooks/useCloudinarySignature"
import useUploadImage from "../../hooks/useUploadImage"

export default function Signup() {

const navigate = useNavigate()

const {data,isSuccess} = useUser()

const {mutate:signup,isLoading:sendingForm} = useSignup()

const {mutate:uploadImage,isLoading:uploadingImage,isSuccess:uploadImageSuccess} = useUploadImage()

useCloudinarySignature()

const [form,setForm] = useState({
    image: "",
    username: '',
    email: "",
    password: "",
    passwordMatch: "",
    emailMatch: "",
})

const [error,setError] = useState({})

const [imageProfile,setImageProfile] = useState('')

const fileHandler = (e)=>{
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = ()=>{
        setImageProfile(reader.result)
        setError(prev => ({
            ...prev,
            image: ''
          }))
    }
    reader.readAsDataURL(file)
}

const formHandler = (e)=>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        })
}

const errorHandler = (validate)=>{
    //username related errors
        const error = {}
        const {username, email, password, emailMatch, passwordMatch, image} = validate
        const exp = /^[a-zA-Z0-9]+$/
        const emailExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        
        //username validation
        error.username = []
        if( username.length > 10 || username.length < 4 ) error.username.push(`Username length must be between 3 and 12 characters  `)
        if( !exp.test(username) ) error.username.push(` Only numbers and letters are allowed`)
        if(!error.username.length) delete error.username 

        //email validation
        if( !emailExp.test(email) ) error.email = 'Invalid email'

        //emailMatch 
        if( emailMatch !== email ) error.emailMatch = 'Email do not match'
        
        //password validation
        if(password.length > 16 || password.length < 8) error.password = `Introduce a password between 8 and 16 characters`
        
        //passwordMatch
        if( passwordMatch !== password ) error.passwordMatch = 'Password do not match'
        
        //image validation
        if( !imageProfile ) error.image = 'Select an image'

        return error
    }

const submitHandler = (e)=>{
    e.preventDefault()
    uploadImage(imageProfile,{
        onSuccess: ({data})=>{
            console.log(data)
            setForm(prev => ({...prev, image: data.url}))
        }
    })
}
useEffect(()=>{
    setError(errorHandler(form))
    if(uploadImageSuccess) signup(form,{
        onSuccess: ()=>{
            navigate("/signin")
        }
    })
},[form])


const Error = function({children}){
        return (
            <ul>
                {
                    Array.isArray(children) ? 
                        children.map(err => <li key={err}>{err}</li>)
                        : (children ? <li>{children}</li> : null)
                }
            </ul>
        )
}
  return (
    <div>
        {
            !isSuccess ?
             <form onSubmit={submitHandler}>

             <fieldset className='form'>
     
                 <legend>Signup</legend>
     
                 <label >Upload profile image</label>
                 <input type="file" onChange={fileHandler}/>
                 <img src={imageProfile} />
                 <Error>{error.image}</Error>
     
                 <label >Username</label>
                 <input type="text" value={form.username} onChange={formHandler} name='username'/>
                 <Error>{error.username}</Error>
                 
                 <label>email</label>
                 <input type="text" name="email" onChange={formHandler} value={form.email}/>
                 <Error>{error.email}</Error>
     
                 <label>Confirm email</label>
                 <input type="text" onChange = {formHandler} name="emailMatch" value={form.emailMatch}/>
                 <Error>{error.emailMatch}</Error>
     
                 <label >password</label>
                 <input type="text" name="password" onChange={formHandler} value={form.password}/>
                 <Error>{error.password}</Error>
     
                 <label>Confirm password</label>
                 <input onChange = {formHandler} name="passwordMatch" type="text" value={form.passwordMatch} />
                 <Error>{error.passwordMatch}</Error>
     
                 <button type="submit" disabled={Object.keys(error).length ? true : false}>
                     send
                 </button>

                 <h3>{uploadingImage && "Uploading Image"}</h3>
                 <h3>{sendingForm && "Sending Form"}</h3>
     
             </fieldset>
             
         </form> 
         : null
        }
   

    </div>
  )
}
