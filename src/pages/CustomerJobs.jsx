// src/pages/CustomerJobs.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";

// Import Services
import { getCustomerById, updateCustomer } from "../services/customerService";

// Import Components
import CustomerHeader from "../components/customers/CustomerHeader";
import JobsHeader from "../components/customers/JobsHeader";
import JobsTable from "../components/customers/JobsTable";
import JobModal from "../components/customers/JobModal";
import EmptyJobsState from "../components/customers/EmptyJobsState";

/**
 * CustomerJobs Component
 * Main component for displaying customer information and managing their jobs
 * Handles job creation, editing, deletion, and searching
 */
const CustomerJobs = () => {
  // Get customer ID from URL parameters
  const { customerId } = useParams(); // Changed from 'id' to 'customerId'
  const navigate = useNavigate();

  // Debug logging
  console.log("CustomerJobs - URL params:", useParams());
  console.log("CustomerJobs - customerId:", customerId);

  // Handle redirect if no ID is provided
  useEffect(() => {
    if (!customerId) {
      console.log("No customerId found, redirecting to /customers");
      navigate("/customers");
    }
  }, [customerId, navigate]);

  // State for customer data
  const [customer, setCustomer] = useState({});

  // State for jobs management
  const [jobsList, setJobsList] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");

  // State for modal visibility
  const [addJobModal, setAddJobModal] = useState(false);

  // Default job template with all required fields
  const [defaultParams] = useState({
    id: null,
    date: new Date().toLocaleDateString("en-GB"),
    hasUnderlay: false,
    hasGrippers: false,
    floorIsGood: false,
    oldFlooringRemoved: false,
    furnitureRemoval: false,
    concrete: false,
    doorsNeedCutting: 0,
    numberOfDoorPlateNeeded: 0,
    comments: "",
  });

  // Current job parameters (for add/edit operations)
  const [params, setParams] = useState(
    JSON.parse(JSON.stringify(defaultParams))
  );

  // Loading state for async operations
  const [loading, setLoading] = useState(true);

  /**
   * Fetch customer data and their jobs on component mount
   * Runs when component loads or customer ID changes
   */
  useEffect(() => {
    if (customerId) {
      const fetchCustomerData = async () => {
        console.log("Fetching customer data for ID:", customerId);
        setLoading(true);

        try {
          // Fetch customer details from the database
          const customerData = await getCustomerById(customerId);
          console.log("✅ Real customer data loaded:", customerData);

          if (customerData) {
            setCustomer(customerData);

            // Set jobs if they exist, otherwise empty array
            if (customerData.jobs && Array.isArray(customerData.jobs)) {
              console.log("Jobs found:", customerData.jobs.length);
              setJobsList(customerData.jobs);
            } else {
              console.log("No jobs found for customer");
              setJobsList([]);
            }
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
          showMessage(
            `Failed to load customer data: ${error.message}`,
            "error"
          );
        } finally {
          setLoading(false);
        }
      };

      fetchCustomerData();
    }
  }, [customerId]);

  /**
   * Filter jobs based on search term
   * Updates filtered items whenever search term or jobs list changes
   */
  useEffect(() => {
    if (search.length !== 0) {
      // Filter jobs that include the search term in the date field
      setFilteredItems(
        jobsList.filter((item) => {
          return item.date.toLowerCase().includes(search.toLowerCase());
        })
      );
    } else {
      // Show all jobs if no search term
      setFilteredItems(jobsList);
    }
  }, [search, jobsList]);

  /**
   * Handle form field changes in job modal
   * Supports text inputs, checkboxes, number inputs, and date inputs
   * @param {Event|string} e - The input change event or direct value
   */
  const handleInputChange = (e) => {
    if (!e.target) {
      // Handle direct value assignment (like from date picker)
      if (typeof e === "string") {
        if (e === "") return;
        setParams({ ...params, date: e });
      } else {
        setParams({ ...params, date: e.value });
      }
      return;
    }

    const { value, id, type, checked } = e.target;

    // Handle different input types appropriately
    if (type === "number") {
      // Convert empty string to 0 for number inputs
      if (value === "") {
        setParams({ ...params, [id]: 0 });
      } else {
        setParams({ ...params, [id]: Number(value) });
      }
    } else if (type === "checkbox") {
      // Set boolean value for checkboxes
      setParams({ ...params, [id]: checked });
    } else {
      // Set string value for text inputs
      setParams({ ...params, [id]: value });
    }
  };

  /**
   * Save job (create new or update existing)
   * Validates input data and updates the database
   */
  const saveJob = async () => {
    // Validate required fields
    if (!params.date) {
      showMessage("Please enter a Date", "error");
      return;
    }

    try {
      if (params.id) {
        // Update existing job
        const updatedJobs = jobsList.map((job) =>
          job.id === params.id ? params : job
        );

        // TEMPORARY: Skip database update when using dummy data
        if (customer.name === "Test Customer") {
          console.log("Using dummy data - skipping database update");
          setJobsList(updatedJobs);
          showMessage("Job updated successfully (test mode)", "success");
        } else {
          // Update customer with updated jobs list (real mode)
          await updateCustomer(customerId, {
            ...customer,
            jobs: updatedJobs,
          });
          setJobsList(updatedJobs);
          showMessage("Job updated successfully", "success");
        }
      } else {
        // Create new job with unique ID
        const newJob = {
          ...params,
          id: uuidv4(),
          feeter: "", // Additional field for job tracking
        };

        // TEMPORARY: Skip database update when using dummy data
        if (customer.name === "Test Customer") {
          console.log("Using dummy data - skipping database update");
          setJobsList([...jobsList, newJob]);
          showMessage("Job added successfully (test mode)", "success");
        } else {
          // Update customer with new job added (real mode)
          await updateCustomer(customerId, {
            ...customer,
            jobs: [...jobsList, newJob],
          });
          setJobsList([...jobsList, newJob]);
          showMessage("Job added successfully", "success");
        }
      }

      // Close modal and reset form
      setAddJobModal(false);
      setParams(JSON.parse(JSON.stringify(defaultParams)));
    } catch (error) {
      console.error("Error saving job:", error);
      showMessage("Failed to save job", "error");
    }
  };

  /**
   * Open job modal for editing or creating
   * @param {Object|null} job - The job to edit, or null for new job
   */
  const editJob = (job = null) => {
    // Reset form with default values
    const defaultValues = JSON.parse(JSON.stringify(defaultParams));
    setParams(defaultValues);

    // If editing, populate form with job data
    if (job) {
      setParams(JSON.parse(JSON.stringify(job)));
    }

    // Open the modal
    setAddJobModal(true);
  };

  /**
   * Delete a job with confirmation
   * @param {Object} job - The job to delete
   */
  const deleteJob = async (job = null) => {
    if (!job) return;

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        // Filter out the job to delete
        const updatedJobs = jobsList.filter((item) => item.id !== job.id);

        // TEMPORARY: Skip database update when using dummy data
        if (customer.name === "Test Customer") {
          console.log("Using dummy data - skipping database update");
          setJobsList(updatedJobs);
          showMessage("Job deleted successfully (test mode)", "success");
        } else {
          // Update customer with filtered jobs (real mode)
          await updateCustomer(customerId, {
            ...customer,
            jobs: updatedJobs,
          });
          setJobsList(updatedJobs);
          showMessage("Job deleted successfully", "success");
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        showMessage("Failed to delete job", "error");
      }
    }
  };

  /**
   * Quick add job with today's date
   * Creates a new job with default values and today's date
   */
  const addJobWithTodayDate = async () => {
    // Format today's date as 'DD/MM/YYYY'
    const today = new Date().toLocaleDateString("en-GB");

    // Create a new job with today's date and default values
    const newJob = {
      id: uuidv4(),
      date: today,
      hasUnderlay: false,
      hasGrippers: false,
      floorIsGood: false,
      oldFlooringRemoved: false,
      furnitureRemoval: false,
      concrete: false,
      doorsNeedCutting: 0,
      numberOfDoorPlateNeeded: 0,
      comments: "",
      feeter: "",
    };

    try {
      // TEMPORARY: Skip database update when using dummy data
      if (customer.name === "Test Customer") {
        console.log("Using dummy data - skipping database update");
        setJobsList([...jobsList, newJob]);
        showMessage("Job added successfully (test mode)", "success");
      } else {
        // Update customer with new job (real mode)
        await updateCustomer(customerId, {
          ...customer,
          jobs: [...jobsList, newJob],
        });
        setJobsList([...jobsList, newJob]);
        showMessage("Job added successfully", "success");
      }
    } catch (error) {
      console.error("Error adding job:", error);
      showMessage("Failed to add job", "error");
    }
  };

  /**
   * Display toast message to user
   * @param {string} msg - Message to display
   * @param {string} type - Type of message (success, error, warning, info)
   */
  const showMessage = (msg = "", type = "success") => {
    Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: "toast" },
    }).fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  // Show loading spinner while data is being fetched or if no ID
  if (loading || !customerId) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Customer Information Header */}
      <CustomerHeader customer={customer} />

      {/* Jobs Management Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Jobs Header with Search and Actions */}
        <JobsHeader
          search={search}
          setSearch={setSearch}
          onAddJob={addJobWithTodayDate}
          onOpenModal={() => editJob()}
        />

        {/* Jobs Content */}
        {filteredItems.length === 0 ? (
          <EmptyJobsState onAddJob={() => editJob()} />
        ) : (
          <JobsTable
            jobs={filteredItems}
            onEditJob={editJob}
            onDeleteJob={deleteJob}
            customerId={customerId}
          />
        )}
      </div>

      {/* Job Add/Edit Modal */}
      <JobModal
        isOpen={addJobModal}
        onClose={() => setAddJobModal(false)}
        params={params}
        onInputChange={handleInputChange}
        onSave={saveJob}
      />
    </div>
  );
};

export default CustomerJobs;
