import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);  // User is logged in
      } else {
        setAuthenticated(false); // No user is logged in
      }
      setLoading(false); // Stop loading once the auth state is determined
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) { 
    return <div className="bg-black w-screen h-screen text-white text-2xl p-2 flex justify-center items-center">
      <span className="loading loading-spinner loading-lg"></span>
      Loading...
    </div>; // Optionally show a loading indicator while auth state is being checked
  }

  return authenticated ? children : <Navigate to ='/' replace/>
}

export default ProtectedRoute;
