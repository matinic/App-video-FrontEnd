import React,{ useState} from 'react'
import style from './Signin.module.css'
import { Link, useNavigate } from 'react-router-dom'
import useLogin from '../../hooks/useLogin'
import useUser from '../../hooks/useUser'

export default function Signin() {

const {data,isSuccess} = useUser()

const [form, setForm] = useState({
    username:'',
    password: ''
})


const navigate = useNavigate()

const { mutate } = useLogin()

const submit = (e)=>{
    e.preventDefault()
    mutate(
            form,
            {
                onError: ({response}) => alert(response.data.message),
                onSuccess: ({data})=> { alert(data.message);  navigate('/') }
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
        <div>
    {
        !isSuccess ?
        <form onSubmit={submit}>
            <fieldset className={style.login}>
                <legend>Signin</legend>
    
                <label htmlFor="">username</label>
                <input type="text" value={form.username} onChange={formHandler} name="username" />
    
                <label htmlFor="">password</label>
                <input type="text" value={form.password} onChange={formHandler} name="password"/>
    
                <button onClick={submit}>Enter</button>
            </fieldset>
            You don´t have an account yet?, <Link to='/signup'>signup</Link>
        </form>
        :null
    }
    
        </div>
        )

    
}
