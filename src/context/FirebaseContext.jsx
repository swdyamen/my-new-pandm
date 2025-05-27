// src/context/FirebaseContext.jsx
import { createContext, useContext } from "react";
import { auth, db, storage } from "../firebase/config";

// Create context
const FirebaseContext = createContext(null);

// Context provider component
export function FirebaseProvider({ children }) {
  const firebase = {
    auth,
    db,
    storage,
  };

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}

// Custom hook for using Firebase
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}
