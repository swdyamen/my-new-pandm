// src/hooks/useJobsData.js
import { useState, useEffect, useCallback } from "react";
import {
  getJobs,
  createJob as apiCreateJob,
  updateJob as apiUpdateJob,
  deleteJob as apiDeleteJob,
} from "../services/jobService";

export function useJobsData(customerId) {
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [jobsError, setJobsError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch jobs for this customer
  useEffect(() => {
    const fetchJobs = async () => {
      setJobsLoading(true);
      setJobsError(null);

      try {
        const jobsData = await getJobs(customerId);
        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobsError(error);
      } finally {
        setJobsLoading(false);
      }
    };

    if (customerId) {
      fetchJobs();
    }
  }, [customerId, refreshTrigger]);

  // Create a new job
  const createJob = async (jobData) => {
    const result = await apiCreateJob(customerId, jobData);
    return result;
  };

  // Update an existing job
  const updateJob = async (jobId, jobData) => {
    const result = await apiUpdateJob(customerId, jobId, jobData);
    return result;
  };

  // Delete a job
  const deleteJob = async (jobId) => {
    const result = await apiDeleteJob(customerId, jobId);
    return result;
  };

  // Refresh jobs data
  const refreshJobs = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return {
    jobs,
    jobsLoading,
    jobsError,
    createJob,
    updateJob,
    deleteJob,
    refreshJobs,
  };
}
