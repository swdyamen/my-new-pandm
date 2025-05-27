// src/firebase/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "./config";

// Register a new user
export async function registerUser(email, password, displayName) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Update profile with displayName
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

// Login user
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw error;
  }
}

// Reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw error;
  }
}
