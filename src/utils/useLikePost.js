import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const useLikePost = () => {
  const [likesStatus, setLikesStatus] = useState({});
  const [likeCounts, setLikeCounts] = useState({});

  // Handle like/unlike action
  const handleLike = async (postId, isLiked) => {
    const postRef = doc(db, "posts", postId);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(auth.currentUser.email), // Remove the user email from the likes array
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(auth.currentUser.email), // Add the user email to the likes array
        });
      }

      // Update local state for the current post
      setLikesStatus((prevState) => ({
        ...prevState,
        [postId]: !isLiked, // Toggle the like status for this post
      }));

      // Fetch updated like count
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postData = postSnap.data();
        setLikeCounts((prevState) => ({
          ...prevState,
          [postId]: postData.likes.length, // Update the like count for the post
        }));
      }
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  // Fetch like data when post is loaded
  const fetchPostLikes = async (postId) => {
    const docRef = doc(db, "posts", postId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const postData = docSnap.data();
      setLikesStatus((prevState) => ({
        ...prevState,
        [postId]: postData.likes?.includes(auth.currentUser.email) || false, // Check if the user liked the post
      }));
      setLikeCounts((prevState) => ({
        ...prevState,
        [postId]: postData.likes?.length || 0, // Store the like count
      }));
    } else {
      console.log("No such post!");
    }
  };

  return { likesStatus, likeCounts, handleLike, fetchPostLikes };
};

export default useLikePost;
