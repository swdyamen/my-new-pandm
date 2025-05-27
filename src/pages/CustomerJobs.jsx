// src/pages/CustomerJobs.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";

// Option 1: Import the entire service (recommended)
import { customerService } from "../services/customerService";

// Option 2: Import specific functions (alternative approach)
// import { getCustomer, getCustomerJobs } from "../services/customerService";

/**
 * CustomerJobs component displays jobs for a specific customer
 */
const CustomerJobs = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customer and their jobs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Option 1: Using the service object
        const customerData = await customerService.getCustomer(id);
        const jobsData = await customerService.getCustomerJobs(id);

        // Option 2: Using the named exports directly
        // const customerData = await getCustomer(id);
        // const jobsData = await getCustomerJobs(id);

        setCustomer(customerData);
        setJobs(jobsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        setError(err.message || "Failed to load customer data");

        // Show error notification
        Swal.fire({
          title: "Error!",
          text: `Failed to load customer data: ${
            err.message || "Unknown error"
          }`,
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setError("Customer ID is missing");
      setLoading(false);
    }
  }, [id]);

  return (
    <div className="max-w-full">
      {/* Header with Back button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/customers"
            className="mr-4 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            ← Back to Customers
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {loading
              ? "Loading..."
              : customer
              ? `Jobs for ${customer.name}`
              : "Customer Jobs"}
          </h1>
        </div>

        {/* Add job button could go here */}
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="p-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Customer details card */}
          {customer && (
            <div className="bg-white p-6 rounded-lg shadow mb-6">
              <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{customer.location || "—"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Jobs table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No jobs found for this customer.
                      </td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr
                        key={job.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {job.title || "Untitled Job"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {job.description
                              ? `${job.description.substring(0, 50)}...`
                              : "No description"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              job.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : job.status === "in-progress"
                                ? "bg-blue-100 text-blue-800"
                                : job.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {job.status || "unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.date
                            ? new Date(
                                job.date.seconds * 1000
                              ).toLocaleDateString()
                            : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {job.amount ? `$${job.amount.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-2">
                            {/* Action buttons would go here */}
                            <button
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                              title="View job details"
                            >
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerJobs;
