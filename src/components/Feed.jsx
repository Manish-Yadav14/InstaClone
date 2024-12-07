import React, { useEffect, useState } from "react";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { FcLike } from "react-icons/fc";
import  {db,auth } from "../firebase/firebase";
import { collection, getDocs,getDoc, updateDoc,doc,arrayUnion,arrayRemove} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector ,useDispatch } from "react-redux";
import logout from "../utils/logout"; 
import {setUser} from '../slices/userSlice';
import useLikePost from "../utils/useLikePost"
import Comments from "./Modals/Comments";

function Feed() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.user);
  const [followStatus,setFollowStatus] = useState([]);

  const { likesStatus, likeCounts, handleLike, fetchPostLikes } = useLikePost();

  const [comments,setComments] = useState({});


  const getUserDetails = async()=>{
    const userRef = doc(db,'users',auth.currentUser.email);
    const userSnap = await getDoc(userRef);
    if(userSnap.exists()){
      dispatch(setUser(userSnap.data()));
    }
  }

  useEffect(()=>{
    getUserDetails();
  },[])

  // Fetch posts from Firestore
  const getPosts = async () => {
    const postSnap = collection(db, "posts");
    const postSnapshot = await getDocs(postSnap);
    const data = postSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPosts(data);
  };

  // Fetch users for the sidebar
  const getUsers = async () => {
    const userSnap = collection(db, "users");
    const userSnapshot = await getDocs(userSnap);
    const data = userSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsers(data.filter((u) => u.email !== user?.email));
  };

  useEffect(() => {
    getPosts();
    getUsers();
  }, [users,posts]);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post) => {
        fetchPostLikes(post.id); // Fetch like status and count when posts are fetched
      });
    }
  }, [posts]);

  //handle comment posting to specific post 
  const handleComment = async(postId,comment)=>{
    const postRef = doc(db,'posts',postId);
    try {
      if(comment){
        await updateDoc(postRef,{
          comments: arrayUnion({user : user.username,comment:comment})
        })
        setComments((prev)=>({...prev,[postId]:""}))
      }else{
        console.log("Enter Comment pls...")
      }
    } catch (err) {
      console.error(err);
    }
  }

  //handle follow users
  const handleFollow = async (email, isFollowed) => {
    const userRef = doc(db, "users", email);
    const currUserRef = doc(db, "users", auth.currentUser.email);
  
    try {
      if (isFollowed) {
        await updateDoc(userRef, {
          followers: arrayRemove(auth.currentUser.email),
        });
        await updateDoc(currUserRef, {
          following: arrayRemove(email),
        });
      } else {
        await updateDoc(userRef, {
          followers: arrayUnion(auth.currentUser.email),
        });
        await updateDoc(currUserRef, {
          following: arrayUnion(email),
        });
      }
  
      setFollowStatus((prev) => ({
        ...prev,
        [email]: !isFollowed,
      }));
    } catch (err) {
      console.error("Error updating follow status:", err);
    }
  };
  

  // const fetchFollowers = async(currUser)=>{
  //   const currUserRef = doc(db,'users',currUser);
  //   const currUserSnap = await getDoc(currUserRef);
  //   if(currUserSnap.exists()){
  //     const data = currUserSnap.data();
  //     setFollowStatus((prev)=>({
  //       ...prev,
  //       [currUser]: data.following?.includes(currUser) || false,
  //     }))
  //   }
  //   else {
  //     console.log("no such user");
  //   }
  // }

  const fetchFollowers = async () => {
    const currUserRef = doc(db, "users", auth.currentUser.email);
    const currUserSnap = await getDoc(currUserRef);
  
    if (currUserSnap.exists()) {
      const data = currUserSnap.data();
      const following = data.following || [];
  
      setFollowStatus(
        users.reduce((status, user) => {
          status[user.email] = following.includes(user.email);
          return status;
        }, {})
      );
    } else {
      console.log("No such user found in Firestore.");
    }
  };
  
  useEffect(() => {
    if (users.length > 0) {
      fetchFollowers();
    }
  }, [users]);

  return (
    <div className="m-2 p-2 flex justify-evenly">
      {/* Posts */}
      <article>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-black rounded-sm max-w-md border-b-2 border-gray-800 mb-8">
              <div className="flex justify-between items-center px-1 py-3">
                <div className="flex items-center">
                  <img className="h-8 w-8 rounded-full" src="/profile.png" />
                  <div className="ml-3">
                    <span className="text-sm font-semibold antialiased text-white block leading-tight">
                      {post?.createdBy}
                    </span>
                  </div>
                </div>
                <button onClick={()=>handleFollow(post?.createdBy,followStatus[post.createdBy])} className="text-blue-800">
                {post.createdBy===auth.currentUser.email ? ("") :(
                  (followStatus[post.createdBy] ? "Unfollow" :"Follow")
                )}
                </button>
              </div>
              <img className="rounded-md w-full" src={post?.imageURL} />
              <div className="flex items-center justify-between mt-3 mb-2">
                <div className="flex gap-5">
                  <button onClick={() => handleLike(post.id, likesStatus[post.id])}>
                    {likesStatus[post.id] ? (
                      <FcLike className="w-6 h-6 text-white" />
                    ) : (
                      <FaRegHeart className="w-6 h-6 text-white" />
                    )}
                  </button>
                  <button onClick={()=>document.getElementById(post.id).showModal()} >
                    <FaRegComment className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
              <div className="font-semibold text-sm text-white mt-3 mb-2">
                {likeCounts[post.id] || 0} like{likeCounts[post.id] !== 1 ? "s" : ""}
              </div>
              <div className="text-white flex">
                <h2 className="mr-2 font-medium">{post.createdBy}</h2>
                <h3 className="mr-2">{post.caption}</h3>
              </div>
              <button 
                onClick={()=>document.getElementById(post.id).showModal()} 
                className="text-gray-500 text-sm m-1">
                View all comments
              </button>
              <Comments id={post.id} postId={post.id}/>
              <div className="mx-1 flex justify-between">
                <input
                  value = {comments[post.id] || ""}
                  onChange={(e)=>setComments((prev)=>({...prev , [post.id]:e.target.value}))}
                  className="text-white bg-black outline-none placeholder:text-gray-500 w-full"
                  type="text"
                  placeholder="Add a Comment..."
                />
                <button onClick={()=>handleComment(post.id,comments[post.id])} className="text-blue-800 font-medium m-1 p-1">Post</button>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </article>

      {/* Sidebar */}
      <aside className="w-[280px] h-[250px] m-4 p-4 text-white">
        <div className="flex items-center mb-3">
          <img className="w-14 h-14 rounded-full" src={user?.profilePicURL} alt="" />
          <p className="m-1 font-medium text-sm">{user?.username}</p>
          <button onClick={()=>logout(navigate,dispatch)} className="text-blue-500 ml-auto">Logout</button>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-sm font-medium text-gray-400">Suggested for you</h1>
            <button className="text-sm font-medium">See All</button>
          </div>
          <div className="overflow-auto h-[200px] m-1 p-1" style={{ scrollbarWidth: "none" }}>
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="py-1">
                  <div className="flex items-center mb-3">
                    <img className="w-10 h-10 rounded-full" src={user?.profilePicURL || "/profile.png"} alt="" />
                    <p className="m-1 font-medium text-sm">{user?.username}</p>
                    <button onClick={()=>handleFollow(user.email,followStatus[user.email])} className="text-blue-500 ml-auto">
                    {followStatus[user.email] ? "Unfollow" :"Follow"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No suggestions</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default Feed;
