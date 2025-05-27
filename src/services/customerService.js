// src/services/customerService.js
import {
  collection,
  doc,
  getDocs,
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
import { db } from "../firebase/config"; // Adjust the import path as needed

// Collection reference
const CUSTOMERS_COLLECTION = "customers";

/**
 * Get customers with optional filtering and pagination
 *
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Promise resolving to customers data
 */
export const getCustomers = async (params = {}) => {
  try {
    const {
      page = 0,
      pageSize = 10,
      name = "",
      phone = "",
      location = "",
      postCode = "",
    } = params;

    // Create a base query reference
    let q = collection(db, CUSTOMERS_COLLECTION);

    // Build query based on provided filters
    const constraints = [];

    // Add where clauses for each non-empty filter
    // Firebase requires separate where clauses for each field
    if (name) {
      // Case-insensitive search for name (if your DB supports it)
      // Using >= and <= for prefix search
      const nameLower = name.toLowerCase();
      const nameUpper = nameLower + "\uf8ff";
      constraints.push(where("nameLower", ">=", nameLower));
      constraints.push(where("nameLower", "<=", nameUpper));
    }

    if (phone) {
      constraints.push(where("phone", ">=", phone));
      constraints.push(where("phone", "<=", phone + "\uf8ff"));
    }

    if (location) {
      constraints.push(where("location", ">=", location));
      constraints.push(where("location", "<=", location + "\uf8ff"));
    }

    if (postCode) {
      constraints.push(where("postCode", ">=", postCode));
      constraints.push(where("postCode", "<=", postCode + "\uf8ff"));
    }

    // Apply constraints if any exist
    if (constraints.length > 0) {
      // Due to Firestore limitations, you might need to restructure this
      // for more complex queries or use composite indexes
      q = query(q, ...constraints);
    } else {
      // Default sorting if no filters are applied
      q = query(q, orderBy("createdAt", "desc"));
    }

    // Apply pagination
    if (page > 0) {
      // Get the last document from the previous page
      const prevPageQuery = query(q, limit(page * pageSize));
      const prevPageDocs = await getDocs(prevPageQuery);
      const lastVisible = prevPageDocs.docs[prevPageDocs.docs.length - 1];

      // Start after the last document from previous page
      if (lastVisible) {
        q = query(q, startAfter(lastVisible), limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }
    } else {
      // First page
      q = query(q, limit(pageSize));
    }

    // Execute the query
    const snapshot = await getDocs(q);

    // Get total count (this is a separate query, might be expensive for large collections)
    // For production, consider caching or approximating this value
    const countSnapshot = await getDocs(collection(db, CUSTOMERS_COLLECTION));
    const totalItems = countSnapshot.size;

    // Format the response
    const customers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      data: customers,
      totalItems,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("Error getting customers:", error);
    throw error;
  }
};

/**
 * Get a single customer by ID
 *
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} Promise resolving to customer data
 */
export const getCustomer = async (id) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Customer ID is required");
    }

    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Customer not found");
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error("Error getting customer:", error);
    throw error;
  }
};

/**
 * Create a new customer
 *
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} Promise resolving to created customer
 */
export const createCustomer = async (customerData) => {
  try {
    // Prepare the data
    const data = {
      ...customerData,
      // Store a lowercase version of name for case-insensitive searches
      nameLower: customerData.name ? customerData.name.toLowerCase() : "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add the document
    const docRef = await addDoc(collection(db, CUSTOMERS_COLLECTION), data);

    return {
      id: docRef.id,
      ...data,
    };
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

/**
 * Update an existing customer
 *
 * @param {string} id - Customer ID
 * @param {Object} customerData - Updated customer data
 * @returns {Promise<Object>} Promise resolving to updated customer
 */
export const updateCustomer = async (id, customerData) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Customer ID is required");
    }

    // Prepare the data
    const data = {
      ...customerData,
      // Update lowercase name if name exists
      ...(customerData.name && { nameLower: customerData.name.toLowerCase() }),
      updatedAt: serverTimestamp(),
    };

    // Update the document
    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    await updateDoc(docRef, data);

    return {
      id,
      ...data,
    };
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

/**
 * Delete a customer
 *
 * @param {string} id - Customer ID to delete
 * @returns {Promise<void>} Promise resolving when customer is deleted
 */
export const deleteCustomer = async (id) => {
  try {
    // Validate ID to prevent the error we're seeing
    if (!id) {
      throw new Error("Cannot delete customer: Invalid customer ID");
    }

    // Trim the ID in case it has whitespace (another common error source)
    const trimmedId = String(id).trim();

    if (trimmedId === "") {
      throw new Error("Cannot delete customer: Empty customer ID");
    }

    // Delete the document
    const docRef = doc(db, CUSTOMERS_COLLECTION, trimmedId);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};

/**
 * Get customer jobs
 *
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} Promise resolving to customer jobs
 */
export const getCustomerJobs = async (customerId) => {
  try {
    // Validate customer ID
    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    // Assuming jobs are stored in a separate collection with a customer reference
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, where("customerId", "==", customerId));

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting customer jobs:", error);
    throw error;
  }
};

// Also export as a single object for backward compatibility
export const customerService = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerJobs,
};

// Export a default object for simpler imports
export default customerService;
