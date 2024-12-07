import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { auth,db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc,doc } from "firebase/firestore";

function Signup() {
  const [fullName,setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const [isLoading,setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      await setDoc(doc(db,'users',user.email),{
        uid:user.uid,
        username:username,
        fullName:fullName,
        email:user.email,
        bio: "",
				profilePicURL: "",
				followers: [],
				following: [],
				posts: [],
        createdAt:new Date(),
      })
      console.log("User Registered Successfully");
      navigate('/home')
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form className="m-2 p-2">
      <input
        className="m-1 p-1 px-4 border-2 w-full rounded-md bg-slate-50"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />
      <input
        className="m-1 p-1 px-4 border-2 w-full rounded-md bg-slate-50"
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        className="m-1 p-1 px-4 border-2 w-full rounded-md bg-slate-50"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="m-1 p-1 px-4 border-2 w-full rounded-md bg-slate-50"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
        
      {error && <p className='border bg-red-200 p-1 px-2 m-2 rounded-md'>{error}</p>}

      <button
        onClick={handleSignup}
        type="submit"
        className="m-1 p-1 mt-2 w-full bg-sky-500 rounded-md text-white "
      >
        {isLoading ? "Loading..." : "Sign Up"}

      </button>
    </form>
  );
}

export default Signup;
