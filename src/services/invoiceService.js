// src/services/invoiceService.js
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

// Collection reference
const INVOICES_COLLECTION = "invoices";

/**
 * Service for handling invoice-related operations with Firestore
 */

/**
 * Get all invoices for a specific customer
 * @param {string} customerId - The customer ID to get invoices for
 * @returns {Promise<Array>} Promise resolving to array of invoices
 */
export const getAllInvoicesOfCustomer = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    // Create a query against the invoices collection
    const q = query(
      collection(db, INVOICES_COLLECTION),
      where("customerId", "==", customerId)
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // If no invoices found, return empty array
    if (querySnapshot.empty) {
      return [];
    }

    // Map the query results to an array of invoice objects
    const invoices = [];
    querySnapshot.forEach((doc) => {
      invoices.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return invoices;
  } catch (error) {
    console.error("Error getting customer invoices:", error);
    return null;
  }
};

/**
 * Get a single invoice by ID
 * @param {string} id - Invoice ID
 * @returns {Promise<Object>} Promise resolving to invoice data
 */
export const getInvoiceById = async (id) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Invoice ID is required");
    }

    const docRef = doc(db, INVOICES_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Invoice not found");
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error("Error getting invoice:", error);
    throw error;
  }
};

/**
 * Create a new invoice
 * @param {Object} invoiceData - Invoice data
 * @returns {Promise<Object>} Promise resolving to created invoice
 */
export const createInvoice = async (invoiceData) => {
  try {
    // Validate required fields
    if (!invoiceData.customerId) {
      throw new Error("Customer ID is required");
    }

    // Prepare the data
    const data = {
      ...invoiceData,
      status: invoiceData.status || "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Add the document
    const docRef = await addDoc(collection(db, INVOICES_COLLECTION), data);

    return {
      id: docRef.id,
      ...data,
    };
  } catch (error) {
    console.error("Error creating invoice:", error);
    throw error;
  }
};

/**
 * Update an existing invoice
 * @param {string} id - Invoice ID
 * @param {Object} invoiceData - Updated invoice data
 * @returns {Promise<Object>} Promise resolving to updated invoice
 */
export const updateInvoice = async (id, invoiceData) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Invoice ID is required");
    }

    // Prepare the data
    const data = {
      ...invoiceData,
      updatedAt: serverTimestamp(),
    };

    // Update the document
    const docRef = doc(db, INVOICES_COLLECTION, id);
    await updateDoc(docRef, data);

    return {
      id,
      ...data,
    };
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

/**
 * Delete an invoice
 * @param {string} id - Invoice ID to delete
 * @returns {Promise<void>} Promise resolving when invoice is deleted
 */
export const deleteInvoice = async (id) => {
  try {
    // Validate ID
    if (!id) {
      throw new Error("Invoice ID is required");
    }

    // Delete the document
    const docRef = doc(db, INVOICES_COLLECTION, id);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    throw error;
  }
};

/**
 * Mark invoice as paid
 * @param {string} id - Invoice ID
 * @returns {Promise<Object>} Promise resolving to updated invoice
 */
export const markInvoiceAsPaid = async (id) => {
  try {
    if (!id) {
      throw new Error("Invoice ID is required");
    }

    const docRef = doc(db, INVOICES_COLLECTION, id);
    await updateDoc(docRef, {
      status: "paid",
      paidAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking invoice as paid:", error);
    throw error;
  }
};

/**
 * Get overdue invoices for a customer
 * @param {string} customerId - Customer ID
 * @returns {Promise<Array>} Promise resolving to array of overdue invoices
 */
export const getOverdueInvoices = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    // Get all invoices for the customer
    const invoices = await getAllInvoicesOfCustomer(customerId);

    // Filter for unpaid invoices with due date in the past
    const today = new Date();
    return invoices.filter((invoice) => {
      const dueDate = invoice.dueDate ? new Date(invoice.dueDate) : null;
      return invoice.status !== "paid" && dueDate && dueDate < today;
    });
  } catch (error) {
    console.error("Error getting overdue invoices:", error);
    throw error;
  }
};

// Export an object with all functions for named imports
export default {
  getAllInvoicesOfCustomer,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  markInvoiceAsPaid,
  getOverdueInvoices,
};
