// src/hooks/useCustomerData.js
import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust import as needed

/**
 * Custom hook for managing customer data operations
 * Enhanced version that handles all customer document formats
 *
 * @param {Object} initialFilters - Initial filter values
 * @param {number} pageSize - Number of items per page
 * @returns {Object} Customer data and operations
 */
export const useCustomerData = (initialFilters = {}, pageSize = 10) => {
  // State for customer data and loading status
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Store the current filters
  const [filters, setFilters] = useState(initialFilters);

  // Update filters when initialFilters change
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  /**
   * Fetch customers with current filters and pagination
   * This implementation handles various document formats
   */
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    //console.log("Fetching customers with filters:", filters);

    try {
      // Reference to the customers collection
      const customersRef = collection(db, "customer");

      // Start with a base query - don't apply complex filters initially
      // This ensures we get all documents and can format them properly
      let q = query(customersRef);

      // Execute the query
      const querySnapshot = await getDocs(q);

      //console.log(`Query returned ${querySnapshot.size} documents`);

      // Transform the query snapshot into an array of customer objects
      // With special handling for different document formats
      const customerList = [];
      querySnapshot.forEach((doc) => {
        // Get the raw data
        const data = doc.data();
        //console.log(`Document ID: ${doc.id}, Data:`, data);

        // Create a properly formatted customer object
        // Handle missing fields and ensure consistent structure
        const customer = {
          // Always use the Firestore document ID
          id: doc.id,
          // Use data fields with fallbacks for missing values
          name: data.name || "Unnamed Customer",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          postCode: data.postCode || "",
          // Add any other needed fields with fallbacks
          createdAt: data.createdAt || null,
          updatedAt: data.updatedAt || null,
        };

        customerList.push(customer);
      });

      // Apply client-side filtering based on the filters
      let filteredList = customerList;

      // Filter by name (case-insensitive)
      if (filters.name && filters.name.trim() !== "") {
        const searchName = filters.name.toLowerCase();
        filteredList = filteredList.filter((customer) =>
          customer.name.toLowerCase().includes(searchName)
        );
      }

      // Filter by phone
      if (filters.phone && filters.phone.trim() !== "") {
        filteredList = filteredList.filter((customer) =>
          customer.phone.includes(filters.phone)
        );
      }

      // Filter by location
      if (filters.location && filters.location.trim() !== "") {
        const searchLocation = filters.location.toLowerCase();
        filteredList = filteredList.filter((customer) =>
          customer.location.toLowerCase().includes(searchLocation)
        );
      }

      // Filter by postCode
      if (filters.postCode && filters.postCode.trim() !== "") {
        filteredList = filteredList.filter((customer) =>
          customer.postCode.includes(filters.postCode)
        );
      }

      //console.log(`After filtering: ${filteredList.length} customers`);

      // Apply client-side pagination
      const startIndex = currentPage * pageSize;
      const paginatedList = filteredList.slice(
        startIndex,
        startIndex + pageSize
      );

      // Set the customer state
      setCustomers(paginatedList);
      setTotalItems(filteredList.length);
      setTotalPages(Math.ceil(filteredList.length / pageSize));
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError(err.message || "Failed to fetch customers");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, pageSize]);

  // Fetch customers when filters or page changes
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /**
   * Refresh customer data
   */
  const refreshData = useCallback(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  /**
   * Create a new customer
   * @param {Object} customerData - New customer data
   * @returns {Promise} Promise resolving to the created customer
   */
  const createCustomer = async (customerData) => {
    try {
      // Prepare the data with required fields
      const data = {
        ...customerData,
        nameLower: customerData.name ? customerData.name.toLowerCase() : "",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Add the document to the customers collection
      const docRef = await addDoc(collection(db, "customer"), data);

      // Return the created customer
      return {
        id: docRef.id,
        ...data,
      };
    } catch (err) {
      console.error("Error creating customer:", err);
      throw err;
    }
  };

  /**
   * Update an existing customer
   * @param {string} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise} Promise resolving to the updated customer
   */
  const updateCustomer = async (id, customerData) => {
    try {
      // Prepare the data with required fields
      const data = {
        ...customerData,
        nameLower: customerData.name ? customerData.name.toLowerCase() : "",
        updatedAt: serverTimestamp(),
      };

      // Update the document
      await updateDoc(doc(db, "customer", id), data);

      // Return the updated customer
      return {
        id,
        ...data,
      };
    } catch (err) {
      console.error("Error updating customer:", err);
      throw err;
    }
  };

  /**
   * Delete a customer
   * @param {string} id - Customer ID
   * @returns {Promise} Promise resolving when the customer is deleted
   */
  const deleteCustomer = async (id) => {
    try {
      // Validate the ID
      if (!id) {
        throw new Error("Customer ID is required");
      }

      // Delete the document
      await deleteDoc(doc(db, "customer", id));

      return { success: true };
    } catch (err) {
      console.error("Error deleting customer:", err);
      throw err;
    }
  };

  /**
   * Navigate to the next page
   */
  const onNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  /**
   * Navigate to the previous page
   */
  const onPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  return {
    customers,
    loading,
    error,
    filters,
    refreshData,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      onNextPage,
      onPrevPage,
    },
  };
};

export default useCustomerData;
