import React,{useState} from 'react'
import Login from '../components/Login'
import Signup from '../components/Signup'
import GoogleAuth from '../components/GoogleAuth';

function AuthPage() {
  const [isLogin,setIsLogin] = useState(true);

  return (
    <div className='h-[647px] flex justify-center items-center'>
        <div className='flex'>
            <div className='mt-2'>
                <img src="/auth.png" alt="" />
            </div>
            <div>
                <div className='flex flex-col justify-center items-center mt-6 p-4 border-2 w-96'>
                    <img className='cursor-pointer h-24' src="/logo.png" alt="Instagram" />
                    {isLogin ? <Login/> : <Signup/>}

                    <div className='flex justify-center items-center'>
                        <div className='m-2 w-[120px] h-[1px] border'></div>
                        <p>OR</p>
                        <div className='m-2 w-[120px] h-[1px] border'></div>
                    </div>

                    <GoogleAuth prefix={isLogin ? "Log in": "Sign Up"}/>
                </div>

                <div className='flex flex-col justify-center items-center mt-4 p-4 border-2 w-96'>
                    <p>
                        {isLogin ? "Don't have an Account?" : "Already have an Account?"}
                        <span onClick={()=>setIsLogin(!isLogin)} className='text-blue-500 px-1 font-semibold cursor-pointer'>
                            {isLogin ? "Sign up" : "Log In" }
                        </span>
                    </p>
                </div>

                <div className='flex flex-col justify-center items-center p-3 w-96'>
                    Get the app.
                    <div className='flex m-2'>
                        <img className='h-10 px-1' src="/playstore.png" alt="" />
                        <img className='h-10 px-1 rounded-lg' src="/microsoft.png" alt="" />
                    </div>
                </div>

            </div>
        </div>
    </div>
  )
}

export default AuthPage