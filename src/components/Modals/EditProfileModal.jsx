import React, { useEffect, useState,useRef } from "react";
import { db,storage,auth } from "../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../slices/userSlice";
import { ref, uploadString, getDownloadURL } from "firebase/storage";


function EditProfileModal() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isLoading ,setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const imageRef = useRef();

  const { user } = useSelector((state) => state.user);

  const handleClose = ()=>{
    document.getElementById('editprofile_modal').close();
  }

  useEffect(() => {
    const userInfo = localStorage.getItem('user-info');
      if (userInfo) {
        dispatch(setUser(JSON.parse(userInfo)));
      }
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
  }, [dispatch]);

  useEffect(() => {
      if (user) {
        console.log(user);
        setFullName(user.fullName);
        setUsername(user.username);
        setBio(user.bio);
        setImageURL(user.profilePicURL);
      }
  }, [user]);


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


  const handleEditProfile = async () => {
    setIsLoading(true);
    let url ="";
    const storageRef = ref(storage, `images/${fileName}`);
    if(image){
      await uploadString(storageRef, image, "data_url");
      url = await getDownloadURL(storageRef);
      setImageURL(url);
      console.log("File uploaded and available at:", url);
    }
    await updateDoc(doc(db, "users", auth.currentUser.email), {
      fullName: fullName,
      username: username,
      bio: bio,
      profilePicURL: url || imageURL,
    });
    localStorage.setItem("user-info", JSON.stringify({ ...user, fullName, username, bio, profilePicURL: url|| imageURL }));  
    dispatch(setUser({ ...user, fullName, username, bio, profilePicURL: url || imageURL }));
    handleClose();
    setIsLoading(false);
    alert("Profile updated successfully!");
  };

  return (
    <dialog
      id="editprofile_modal"
      className="modal-box bg-black border-2 border-gray-800"
    >
      <div className="bg-black text-white">
        <h1 className="text-3xl mb-6 m-2">Edit Profile</h1>

        <div className="flex mx-3 m-1 justify-around items-center">
          <img
            className="m-1 p-1 rounded-full w-32 h-32 border"
            src={image || imageURL}
            alt="Profile"
          />
          <button onClick={() => imageRef.current.click()} className="bg-gray-900 text-white m-1 p-3 w-[220px] text-lg rounded-md">
            Edit Profile Picture
          </button>
          <input
            ref={imageRef}
            onChange={handleImageChange}
            className="hidden"
            type="file"
            accept="image/*"
          />
        </div>

        <label className="m-2 p-2" htmlFor="fullName">
          Full Name
        </label>
        <input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="bg-black w-full p-2 m-2 border-2 border-gray-800 rounded-md outline-none"
        />

        <label className="m-2 p-2" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-black w-full p-2 m-2 border-2 border-gray-800 rounded-md outline-none"
        />

        <label className="m-2 p-2" htmlFor="bio">
          Bio
        </label>
        <input
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="bg-black w-full p-2 m-2 border-2 border-gray-800 rounded-md outline-none"
        />
        <div className="ml-4 flex justify-center items-center">
          <button
            onClick={handleClose}
            className="bg-red-500 rounded-md text-white m-2 p-2 w-full text-md"
          >
            Cancel
          </button>
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 rounded-md text-white m-2 p-2 w-full text-md"
          >
             {isLoading ?  <span className="loading loading-spinner loading-md"></span> : "Submit"}
          </button>
        </div>

        <button
          onClick={handleClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
}

export default EditProfileModal;
