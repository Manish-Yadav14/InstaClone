import React, { useState,useEffect } from "react";
import { FaImage } from "react-icons/fa6";
import { db, auth } from "../../firebase/firebase";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";

function SearchModal() {
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearch = async () => {
    try {
      const usersRef = collection(db, "users");
      const userSnapShot = await getDocs(usersRef);
      const users = userSnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (searchInput != "") {
        const searchedusers = users.filter(
          (user) =>
            user.uid != auth.currentUser.uid &&
            user.username.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredUsers(searchedusers);
      }
      if (searchInput == "") setFilteredUsers([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(()=>{
    handleSearch();
  },[searchInput])

  return (
    <>
      <dialog
        id="search_modal"
        className="modal-box bg-black border-2 border-gray-800"
      >
        <div className="bg-black text-white">
          <h1 className="text-2xl mb-6">Search User</h1>
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="bg-black w-full p-2 m-1 border-2 border-gray-800 rounded-md outline-none"
            placeholder="Enter Username to search user"
          />
          {/* Searched Users List */}
          <div
            style={{ scrollbarWidth: "none" }}
            className="overflow-y-auto overscroll-y-auto min-h-1 max-h-52"
          >
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.uid} className="flex m-2 p-1 justify-between items-center">
                  <div className="flex justify-start items-center">
                    <img
                      className="h-12 w-12 rounded-full border"
                      src={user.profilePicURL || '/profile.png'}
                      alt=""
                    />
                    <div className="m-2 p-2">
                      <h1>{user.username}</h1>
                      <p>{user.followers.length} followers</p>
                    </div>
                  </div>
                  <button className="text-blue-700 font-semibold">
                    Follow
                  </button>
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
          <button
            onClick={() => document.getElementById("search_modal").close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </div>
      </dialog>
    </>
  );
}

export default SearchModal;
