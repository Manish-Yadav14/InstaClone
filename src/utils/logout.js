import {auth} from '../firebase/firebase'
import {signOut} from "firebase/auth";
import {useDispatch} from 'react-redux'
import { clearUserProfile } from '../slices/userSlice';

const logout = async(navigate,dispatch)=>{
    try {
        await signOut(auth);
        dispatch(clearUserProfile());
        localStorage.clear();
        console.log("User Logout Successfully...");
        localStorage.clear();
        navigate('/')
    } catch (error) {
        console.error(error);
    }
}

export default logout;



