// src/pages/Customers.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CustomerForm from "../components/customers/CustomerForm";
import SearchFilters from "../components/customers/SearchFilters";
import CustomerTable from "../components/customers/CustomerTable"; // Import the CustomerTable component
import IconUserPlus from "../components/icons/IconUserPlus";
import { useCustomerData } from "../hooks/useCustomerData";

/**
 * Customers page component
 * Displays a list of customers with search filtering, pagination, and CRUD operations
 */
const Customers = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Initialize search filters state
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    location: "",
    postCode: "",
  });

  // Use our custom hook for customer data operations
  const {
    customers,
    loading,
    error,
    pagination,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    refreshData,
  } = useCustomerData(filters);

  // Effect to refresh data when filters change
  useEffect(() => {
    // Debounce the filter changes to avoid too many API calls
    const timeoutId = setTimeout(() => {
      refreshData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, refreshData]);

  /**
   * Open the customer form modal for creating or editing
   * @param {Object|null} customer - Customer to edit, or null for a new customer
   */
  const handleEditCustomer = (customer = null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  /**
   * Delete a customer after confirmation
   * @param {Object} customer - Customer to delete
   */
  const handleDeleteCustomer = (customer) => {
    // Validate that customer and customer.id exist to prevent errors
    if (!customer || !customer.id) {
      Swal.fire({
        title: "Error!",
        text: "Cannot delete customer: Invalid customer data",
        icon: "error",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Try/catch block to handle errors
        try {
          deleteCustomer(customer.id)
            .then(() => {
              Swal.fire({
                title: "Deleted!",
                text: "Customer deleted successfully",
                icon: "success",
                toast: true,
                position: "top-end",
                timer: 3000,
                showConfirmButton: false,
              });
              refreshData();
            })
            .catch((err) => {
              console.error("Delete error:", err);
              Swal.fire({
                title: "Error!",
                text: `Failed to delete customer: ${
                  err.message || "Unknown error"
                }`,
                icon: "error",
              });
            });
        } catch (err) {
          console.error("Delete exception:", err);
          Swal.fire({
            title: "Error!",
            text: `An unexpected error occurred: ${
              err.message || "Unknown error"
            }`,
            icon: "error",
          });
        }
      }
    });
  };

  /**
   * Save a new customer or update an existing one
   * @param {Object} customerData - The customer data to save
   */
  const handleSaveCustomer = async (customerData) => {
    try {
      if (customerData.id) {
        // Update existing customer
        await updateCustomer(customerData.id, customerData);
        Swal.fire({
          title: "Success!",
          text: "Customer updated successfully",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      } else {
        // Create new customer
        await createCustomer(customerData);
        Swal.fire({
          title: "Success!",
          text: "Customer created successfully",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
        });
      }
      setIsModalOpen(false);
      refreshData();
    } catch (err) {
      console.error("Save error:", err);
      Swal.fire({
        title: "Error!",
        text: `Failed to save customer: ${err.message || "Unknown error"}`,
        icon: "error",
      });
    }
  };

  /**
   * Navigate to customer jobs page
   * @param {string|number} customerId - ID of the customer
   */
  const handleViewJobs = (customerId) => {
    console.log("handleViewJobs called with:", customerId);

    if (!customerId) {
      console.log("No customer ID provided");
      Swal.fire({
        title: "Error!",
        text: "Cannot view jobs: Invalid customer ID",
        icon: "error",
      });
      return;
    }

    const targetPath = `/customers/${customerId}/jobs`;
    console.log("Attempting to navigate to:", targetPath);

    try {
      navigate(targetPath);
      console.log("Navigation called successfully");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  /**
   * Clear all search filters
   */
  const clearFilters = () => {
    setFilters({ name: "", phone: "", location: "", postCode: "" });
  };

  // Debug - log current customers data
  //console.log("Current customers data:", customers);

  return (
    <div className="max-w-full">
      {/* Header with Add Customer button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          onClick={() => handleEditCustomer()}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          aria-label="Add new customer"
        >
          <IconUserPlus className="w-5 h-5 mr-2" />
          Add Customer
        </button>
      </div>

      {/* Search Filters Component */}
      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Display error message if any */}
      {error && (
        <div className="p-4 mb-6 bg-red-50 border-l-4 border-red-500 text-red-700">
          <p className="font-medium">Error loading customers</p>
          <p>{error}</p>
        </div>
      )}

      {/* Customer Table Component */}
      <CustomerTable
        customers={customers}
        loading={loading}
        pagination={pagination}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        onViewJobs={handleViewJobs}
      />

      {/* Customer form modal */}
      <CustomerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default Customers;
