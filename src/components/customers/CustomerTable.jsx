// src/components/customers/CustomerTable.jsx
import React from "react";
import IconUser from "../../components/icons/IconUser";
import IconEdit from "../../components/icons/IconEdit";
import IconTrash from "../../components/icons/IconTrash";
import IconTrendingUp from "../../components//icons/IconTrendingUp";

/**
 * Enhanced customer table component with light theme and improved UI/UX
 * Displays customer data in a responsive table with action buttons
 *
 * @param {Object} props - Component props
 * @param {Array} props.customers - Array of customer objects to display
 * @param {boolean} props.loading - Whether data is currently loading
 * @param {Object} props.pagination - Pagination configuration and handlers
 * @param {Function} props.onEdit - Function to handle customer editing
 * @param {Function} props.onDelete - Function to handle customer deletion
 * @param {Function} props.onViewJobs - Function to handle viewing customer jobs
 * @returns {JSX.Element} Rendered component
 */
const CustomerTable = ({
  customers,
  loading,
  pagination,
  onEdit,
  onDelete,
  onViewJobs,
}) => {
  // Show loading state with animated spinner
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center">
        <div className="flex flex-col items-center">
          {/* Animated loading spinner */}
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  // Show empty state when no customers are found
  if (!customers || customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="flex flex-col items-center">
          <IconUser className="w-16 h-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No Customers Found
          </h3>
          <p className="mt-2 text-gray-500">
            Try adjusting your search or add a new customer to get started.
          </p>
          {/* Add a helpful action button for empty state */}
          <button
            onClick={() => onEdit()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            aria-label="Add new customer"
          >
            Add Customer
          </button>
        </div>
      </div>
    );
  }

  // Table container - only render when we have customers
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200">
      {/* Responsive table with horizontal scroll on small screens */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Table headers - using uppercase tracking for better readability */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Post Code
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map through customer data to create table rows */}
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Customer name cell with avatar */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Customer avatar/icon */}
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <IconUser className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {customer.name || "—"}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Email cell - with fallback for missing data */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.email || "—"}
                </td>

                {/* Location cell - with truncation for long text */}
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  <div
                    title={customer.location}
                    className="truncate max-w-[200px]"
                  >
                    {customer.location || "—"}
                  </div>
                </td>

                {/* Phone number cell */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.phone || "—"}
                </td>

                {/* Post code cell */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {customer.postCode || "—"}
                </td>

                {/* Actions cell with edit, delete and view jobs buttons */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center space-x-2">
                    {/* Edit button with tooltip and accessibility attributes */}
                    <button
                      onClick={() => onEdit(customer)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors p-2 rounded-full hover:bg-indigo-50"
                      aria-label={`Edit ${customer.name}`}
                      title="Edit customer"
                    >
                      <IconEdit className="h-5 w-5" />
                      <span className="sr-only">Edit {customer.name}</span>
                    </button>

                    {/* Delete button with tooltip and accessibility attributes */}
                    <button
                      onClick={() => onDelete(customer)}
                      className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-full hover:bg-red-50"
                      aria-label={`Delete ${customer.name}`}
                      title="Delete customer"
                    >
                      <IconTrash className="h-5 w-5" />
                      <span className="sr-only">Delete {customer.name}</span>
                    </button>

                    {/* View jobs button with tooltip and accessibility attributes */}
                    <button
                      onClick={() => {
                        onViewJobs(customer.id);
                      }}
                      className="text-green-600 hover:text-green-900 transition-colors p-2 rounded-full hover:bg-green-50"
                      aria-label={`View jobs for ${customer.name}`}
                      title="View jobs"
                    >
                      <IconTrendingUp className="h-5 w-5" />
                      <span className="sr-only">
                        View jobs for {customer.name}
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls - only show if we have multiple pages */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="flex-1 flex justify-between items-center">
            {/* Previous page button */}
            <button
              onClick={pagination.onPrevPage}
              disabled={pagination.currentPage === 0}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md transition-colors ${
                pagination.currentPage === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Previous page"
            >
              Previous
            </button>

            {/* Page indicator */}
            <span className="text-sm text-gray-700">
              Page {pagination.currentPage + 1} of {pagination.totalPages}
            </span>

            {/* Next page button */}
            <button
              onClick={pagination.onNextPage}
              disabled={pagination.currentPage >= pagination.totalPages - 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md transition-colors ${
                pagination.currentPage >= pagination.totalPages - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
