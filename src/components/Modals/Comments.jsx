import React,{useState} from "react";
import { db, auth } from "../../firebase/firebase";
import {getDoc,doc} from "firebase/firestore";

function Comments({ postId }) {
  const [comments, setComments] = useState([]);

  const GetComments = async() =>{
    const postRef = doc(db,'posts',postId);
    const postSnap = await getDoc(postRef);
    if(postSnap.exists()) setComments(postSnap.data().comments);
    // console.log(comments)
  }

  GetComments();

  return (
    <dialog id={postId} className="modal-box bg-black border-2 border-gray-800">
      <div className="text-white">
        <h1 className="font-bold text-2xl mb-4 p-1">Comments...</h1>
        {comments.length>0 ? (
            comments.map((com)=>(
                <div key={com.user+com.comment} className="flex my-3 p-2 items-center">
                    <img className="w-9 h-9 rounded-full" src="/profile.png" alt="" />
                    <div className="font-bold pl-1">{com.user}</div>
                    <div className="pl-1 text-lg">{com.comment}</div>
                </div>
            ))
        ):(
            <p className="my-2 p-1">No Comments</p>
        )}
        <button
          onClick={() => document.getElementById(postId).close()}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
      </div>
    </dialog>
  );
}

export default Comments;
