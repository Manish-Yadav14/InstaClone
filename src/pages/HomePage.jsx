import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { FiPlusSquare } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import logout from '../utils/logout'
import PostModal from '../components/Modals/PostModal'
import SearchModal from '../components/Modals/SearchModal'
import ProfilePage from '../pages/ProfilePage'
import Feed from "../components/Feed"
import { useDispatch, useSelector } from "react-redux";
import {setUser} from '../slices/userSlice';
import  {db,auth } from "../firebase/firebase";
import {getDoc,doc} from "firebase/firestore";

function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [openProfile,setOpenProfile] = useState(false);
  const [openFeed ,setOpenFeed] = useState(true);
  const { user } = useSelector((state) => state.user);

  const getUserDetails = async()=>{
    const userRef = doc(db,'users',auth.currentUser.email);
    const userSnap = await getDoc(userRef);
    if(userSnap.exists()){
      dispatch(setUser(userSnap.data()));
    }
  }

  useEffect(()=>{
    if(!user){
      getUserDetails();
    }
  },[user])
  
  return (
    <>
    <div className="flex w-full bg-black">
      <div className="w-1/6 h-full border-r-2 border-r-gray-950">
        <img className="h-16 m-2 invert" src="/logo.png" alt="" />
        <ul className="text-white pt-4 m-2">
          <li onClick={()=>(setOpenFeed(true),setOpenProfile(false))} className="flex justify-start items-center m-2 p-2 text-lg cursor-pointer">
            <span className="pr-3 text-2xl">
              <AiFillHome />
            </span>
            Home
          </li>
          <li onClick={() => document.getElementById("search_modal").showModal()} className="flex justify-start items-center m-2 p-2 text-lg cursor-pointer">
            <span className="pr-3 text-2xl">
              <IoSearch />
            </span>
            Search
          </li>
          <li className="flex justify-start items-center m-2 p-2 text-lg cursor-pointer">
            <span className="pr-3 text-2xl">
              <FaRegHeart />
            </span>
            Notifications
          </li>
          <li onClick={() => document.getElementById("post_modal").showModal()} className="flex justify-start items-center m-2 p-2 text-lg cursor-pointer">
            <span className="pr-3 text-2xl">
              <FiPlusSquare />
            </span>
            Create
          </li>
          <li onClick={()=>(setOpenProfile(true),setOpenFeed(false))} className="flex justify-start items-center m-2 p-2 text-lg cursor-pointer">
            <span className="pr-3 text-2xl">
              <img className="rounded-full border-1 h-9 w-9" src={user?.profilePicURL} alt="" />
            </span>
            Profile
          </li>
          {/* Logout Button */}
          <li onClick={()=>logout(navigate,dispatch)} className="flex justify-start items-center m-2 p-2 mt-52 text-lg cursor-pointer">
            <span className="pr-3 text-2xl"><BiLogOut/></span> 
            Logout
          </li>
        </ul>
      </div>

      <div className="w-5/6 h-screen overflow-auto">
        <PostModal/>
        <SearchModal/>
        {openProfile && <ProfilePage/>}
        {openFeed && <Feed/>}
      </div>
      
    </div>
    </>
  );
}

export default HomePage;
