import React,{useEffect} from "react";
import EditProfileModal from "../components/Modals/EditProfileModal";
import { useSelector,useDispatch } from "react-redux";
import {setUser} from '../slices/userSlice';
import  {db,auth } from "../firebase/firebase";
import {getDoc,doc} from "firebase/firestore";

function ProfilePage() {
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const getUserDetails = async()=>{
      const userRef = doc(db,'users',auth.currentUser.email);
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()){
        dispatch(setUser(userSnap.data()));
      }
    }
    getUserDetails();
    const handleStorageChange = ()=>{
      const userInfo = localStorage.getItem('user-info');
      if (userInfo) {
        dispatch(setUser(JSON.parse(userInfo)));
      }
    }
    window.addEventListener('storage',handleStorageChange);

    return ()=>{
      window.removeEventListener('storage',handleStorageChange);
    } 
  }, [dispatch,user]);

  return (
    <>
      <div id="profile" className="flex mx-48 mt-8 border-b border-gray-800">
        <div className="m-2 p-2 text-white flex justify-center items-center">
          <img className="h-[120px] w-[120px] rounded-full m-2 mt-3 mx-8 border" src={user?.profilePicURL} alt="" />
          <div className="mb-1">
            <div className="flex justify-start items-center">
              <h1 className="m-1">{user?.username}</h1>
              <button onClick={()=>document.getElementById('editprofile_modal').showModal()} className="m-1 mx-2 p-2 border bg-white text-black rounded-md font-semibold text-sm">
                Edit Profile
              </button>
            </div>
            <div className="flex text-sm">
              <p className="m-1">{(user?.posts)?.length ?? 0} Posts</p>
              <p className="m-1 mx-2">{(user?.followers)?.length ?? 0} followers</p>
              <p className="m-1 mx-2">{(user?.following)?.length ?? 0} following</p>
            </div>
            <h1 className="m-1 font-mono font-semibold">{user?.fullName}</h1>
            <p className="m-1 text-sm">{user?.bio}</p>
          </div>
        </div>
      </div>


      <div>
        <EditProfileModal/>
      </div>
    </>
  );
}

export default ProfilePage;
