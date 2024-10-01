import { useContext, useState } from 'react'
import './LoginPopUp.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'

import { toast } from'react-toastify'

import axios from 'axios'

const LoginPopUp = ({ setShowLogin }) => {

    const {url,setToken} = useContext(StoreContext)
    const [currState, setCurrState] = useState("Login")
    const [data,setData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({...data, [name]: value }))
    }

    const onLogin = async(event) => {
        event.preventDefault()
        let newUrl = url;
        if (currState === "Login") {
            newUrl += '/api/user/login'
        } 
        else {
            newUrl += '/api/user/register'
        }
        const response = await axios.post(newUrl,data);

        if(response.data.success){
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token); 
            setShowLogin(false);
            toast.success("Logged in successfully!")
        } else {
            toast.error(response.data.message)
        }
        setData({name: '', email: '', password: ''})
    }

   
    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className='login-popup-container'>
                <div className='login-popup-title'>
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} />
                </div>
                <div className='login-popup-inputs'>
                    {currState === "Login" ? <></> : <input type='text' name='name' onChange={onChangeHandler} value={data.name} placeholder='your name..' required />}

                    <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type='password' placeholder='your password' required />
                </div>
                <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
                <div className='login-popup-condition'>
                    <input type='checkbox' required />
                    <p> By continuing, I agree to the terms, policy, and other content.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account?<span onClick={() =>setCurrState("Sing Up")}>Click here</span></p>
                    : <p>Already have an account?<span onClick={()=>setCurrState("Login")}>Login here</span></p>

                }
            </form>
        </div>
    )
}

export default LoginPopUp