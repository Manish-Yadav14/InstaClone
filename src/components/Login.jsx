import React, { useState } from 'react'
import {useNavigate} from 'react-router-dom';
import {auth,db} from '../firebase/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import {doc, getDoc} from 'firebase/firestore';
import { setUser } from "../slices/userSlice";
import { useDispatch } from "react-redux";


function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [isLoading,setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (e)=>{
        try {
            e.preventDefault();
            setIsLoading(true);
            const res = await signInWithEmailAndPassword(auth,email,password);
            if(res){
                const userRef = doc(db,'users',res.user.email);
                const userSnap = await getDoc(userRef);
                if(userSnap.exists()){
                    dispatch(setUser(userSnap.data()));
                    localStorage.setItem('user-info',JSON.stringify(userSnap.data()));
                    console.log("User logged in Successfully",res);
                    navigate('/home')
                    setIsLoading(true);
                }
            }
        } catch (error) {
            setError(error.message);
        }
        
    }

  return (
    <form className='m-2 p-2'>
        <input 
            className='m-1 p-1 px-4 border-2 w-full rounded-md bg-slate-50'
            type="email"  
            placeholder='Email' 
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
        />
        <input  
            className='m-1 p-1 px-4 border-2 w-full rounded-md bg-slate-50'
            type="password"
            placeholder='Password' 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
        />
        {error && <p className='border bg-red-200 p-1 px-2 m-2 rounded-md'>{error}</p>}
        <button 
            onClick={handleLogin}
            type='submit' 
            className='m-1 p-1 mt-2 w-full bg-sky-500 rounded-md text-white '>
                {isLoading? "Loading...":"Log In"}
        </button>
    </form>
  )
}

export default Login