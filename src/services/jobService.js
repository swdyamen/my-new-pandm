// src/services/jobService.js
import { db } from "../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

// Get all jobs for a customer
export const getJobs = async (customerId) => {
  try {
    const jobsRef = collection(db, "jobs");
    const q = query(
      jobsRef,
      where("customerId", "==", customerId),
      orderBy("date", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting jobs:", error);
    throw error;
  }
};

// Get a single job
export const getJob = async (customerId, jobId) => {
  try {
    const jobRef = doc(db, "jobs", jobId);
    const jobDoc = await getDoc(jobRef);

    if (!jobDoc.exists()) {
      return null;
    }

    const jobData = jobDoc.data();

    // Verify this job belongs to the customer
    if (jobData.customerId !== customerId) {
      return null;
    }

    return {
      id: jobDoc.id,
      ...jobData,
    };
  } catch (error) {
    console.error("Error getting job:", error);
    throw error;
  }
};

// Create a new job
export const createJob = async (customerId, jobData) => {
  try {
    const jobsRef = collection(db, "jobs");

    const newJob = {
      ...jobData,
      customerId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(jobsRef, newJob);

    return docRef.id;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Update a job
export const updateJob = async (customerId, jobId, jobData) => {
  try {
    // First check if job exists and belongs to this customer
    const existingJob = await getJob(customerId, jobId);

    if (!existingJob) {
      throw new Error("Job not found or does not belong to this customer");
    }

    const jobRef = doc(db, "jobs", jobId);

    // Remove id from the data to update
    const { id, ...dataToUpdate } = jobData;

    const updatedData = {
      ...dataToUpdate,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(jobRef, updatedData);

    return true;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (customerId, jobId) => {
  try {
    // First check if job exists and belongs to this customer
    const existingJob = await getJob(customerId, jobId);

    if (!existingJob) {
      throw new Error("Job not found or does not belong to this customer");
    }

    const jobRef = doc(db, "jobs", jobId);
    await deleteDoc(jobRef);

    return true;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
