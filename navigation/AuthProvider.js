import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      setUser(currentuser);
    });

    return unsubscribe;
  }, [user]);
  return (
    <AuthContext.Provider
      value={{
        user,
        logIn: async (email, password) => {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
          } catch (e) {
            console.log(e.message);
          }
        },

        signUp: async (name, email, password) => {
          try {
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );

            const user = userCredential.user;
            updateProfile(auth.currentUser, {
              displayName: name,
            });
          } catch (e) {
            console.log(e);
          }
        },

        logOut: async () => {
          try {
            await signOut(auth);
          } catch (e) {
            //  console.log(error.messages);

            console.error(e);
          }
        },
        loginWithGoogle: async () => {
          const provider = new GoogleAuthProvider();
          // const auth = getAuth();
          try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
          } catch (error) {
            console.log("error no login with Google", error);
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export function useAuthContext() {
  return useContext(AuthContext);
}
