import React,{ useState} from 'react'
import style from './Signin.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { useSignin } from '../../hooks/mutationHooks';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useQueryClient } from '@tanstack/react-query';

export default function Signin() {

const [form, setForm] = useState({
    username:'',
    password: ''
})
const [passwordVisibility,setPasswordVisibility] = useState(false)

const queryClient = useQueryClient()

const navigate = useNavigate()

const { mutate, isLoading  } = useSignin()

const submit = (e)=>{
    e.preventDefault()
    mutate(
            form,
            {
                onError: ({response}) => alert(response.data.message),
                onSuccess: ()=>{ 
                    navigate('/')
                },
                onSettled: ()=>{
                    queryClient.cancelQueries(['users'])
                    queryClient.invalidateQueries(['users'])
                }
            }
        )
}

const formHandler = (e)=>{
    setForm({
        ...form,
        [e.target.name] : e.target.value
    })
}

    return (
        <div className={style.formContainer}>
            <form onSubmit={submit}>
                <fieldset className={style.login}>
                    <legend>Signin</legend>
        
                    <label htmlFor="">username</label>
                    <input type="text" value={form.username} onChange={formHandler} name="username" autoComplete='username'/>
                    
                    <div className={style.password}>
                        <label htmlFor="">password</label>
                        <div
                            className={style.inputContainer}   
                        >
                            <input type={passwordVisibility ? "text" : "password"} value={form.password} onChange={formHandler} name="password" data-name="password" autoComplete='current-password'/>
                            <div
                                className={style.visibilityButton}
                                onClick={()=>setPasswordVisibility(!passwordVisibility)}
                            >
                                <VisibilityIcon
                                    className={style.visibility}
                                    data-visibility={passwordVisibility}
                                ></VisibilityIcon>
                                <VisibilityOffIcon
                                    className={style.visibilityOff}
                                    data-visibility={passwordVisibility}
                                ></VisibilityOffIcon>
                            
                            </div>
                        </div>
                    </div>

                    <button onClick={submit}>Enter</button>
                    {
                    isLoading &&     (
                                <Box sx={{ width: '100%' }}>
                                    <LinearProgress />
                                </Box>
                                )
                    }
                    
                </fieldset>
                You don't have an account yet?, <Link to='/signup'>signup</Link>
            </form>
              
            
        </div>
    )

    
}
