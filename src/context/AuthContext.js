import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
  import React, { createContext, useEffect } from "react";
  import { useNavigate } from "react-router-dom";
  import { auth } from "../auth/firebase";
import { toastErrorNotify, toastSuccessNotify } from "../helpers/ToastNotify";
  
  
  export const AuthContext = createContext();  
  const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
      JSON.parse(sessionStorage.getItem("user")) || false
    );
    const navigate = useNavigate();

    useEffect(() => {
      userObserver();
    }, []);
  


    const createUser = async (email, password) => {
      try {
        let userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        navigate("/");
        toastSuccessNotify("Registered successfully!")
      } catch (error) {
        toastErrorNotify(error.message)
      }
    };
  
    const signIn = async (email, password) => {
     
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/");
        toastSuccessNotify("Logged in successfully!")
      } catch (error) {
        toastErrorNotify(error.message)
      }
    };
  
    const logOut = () => {
      signOut(auth);
    };
    const userObserver = () => {
      
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const { email, displayName, photoURL } = user;
          setCurrentUser({ email, displayName, photoURL });
          sessionStorage.setItem(
            "user",
            JSON.stringify({ email, displayName, photoURL })
          );
        } else {
          setCurrentUser(false);
          sessionStorage.clear();
          // console.log("logged out");
        }
      });
    };
  
  

    const values = {
      createUser,
      signIn,
      logOut,
      currentUser,
    };
    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
  };
  
  export default AuthContextProvider;
  