import React, { useState, useRef } from "react";
import { FaImage } from "react-icons/fa6";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../../firebase/firebase";
import { setDoc,doc,updateDoc,arrayUnion, getDoc } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid';
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../slices/userSlice";



function PostModal() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [post, setPost] = useState("");
  const [isLoading,setIsLoading] = useState(false);
  const imageRef = useRef();

  const {user} = useSelector((state)=>state.user);

  const dispatch =  useDispatch();

  const handleClose = ()=>{
    document.getElementById("post_modal").close();
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the base64-encoded string
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if(!post && !image) alert("Please Select Image and Enter Post before Posting!")
    else if(!image) alert("Please Select a Image!")
    else if(!post) alert("Please Enter Post Caption Also!")
    else if (image && post) {
      setIsLoading(true);
      try {
        const storageRef = ref(storage, `images/${fileName}`); // Create a reference to 'images/imageName'
        await uploadString(storageRef, image, "data_url");
        const url = await getDownloadURL(storageRef);
        console.log("File uploaded and available at:", url);
        const postId = uuidv4();
        await setDoc(doc(db,'posts',postId),{
          postId:postId,
          caption : post,
          imageURL : url,
          likes :[],
          comments:[],
          createdBy: auth.currentUser.email,
          createdAt : Date.now()
        })
        const userDocRef = doc(db,'users',auth.currentUser.email);
        await updateDoc(userDocRef, { posts: arrayUnion(postId) });
        const userData = await getDoc(userDocRef)
        console.log(userData);
        if (userData.exists()) {
          dispatch(setUser(userData.data()));
          localStorage.setItem("user-info", JSON.stringify(userData.data()));  
        }
        console.log("Post Created Successfully");
        alert("Post Created Successfully!");
        setPost("");
        setImage(null);
        setFileName("")
        setIsLoading(false);
        handleClose()
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  };

  return (
    <>
      <dialog
        id="post_modal"
        className="modal-box bg-black border-2 border-gray-800"
      >
        <div className="bg-black text-white">
          <h1 className="text-2xl mb-3">Create Post</h1>
          <textarea
            value={post}
            onChange={(e) => setPost(e.target.value)}
            required
            placeholder="Post Caption"
            className="bg-black w-full h-24 p-2 border-2 border-gray-800 rounded-md outline-none"
          />
          <button
            onClick={() => imageRef.current.click()}
            className="flex m-2 p-2"
          >
            <FaImage />
          </button>
          <input
            ref={imageRef}
            onChange={handleImageChange}
            className="hidden"
            type="file"
            accept="image/*"
          />
          {image && <img src={image} alt="Uploaded" />}
          <button
            type="submit"
            onClick={handlePost}
            className="bg-gray-900 m-2 p-2 w-16 rounded-md"
          >
            {isLoading ?  <span className="loading loading-spinner loading-lg"></span> : "Post"}

          </button>
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </div>
      </dialog>
    </>
  );
}

export default PostModal;
