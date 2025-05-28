// src/components/InvoiceTable.jsx
import React, { useState, useMemo } from "react";
import { formatDateToString } from "../utils/dateHelpers";

/**
 * InvoiceTable Component
 * Displays a table of invoice data with sorting functionality
 *
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of invoice objects
 */
const InvoiceTable = ({ data = [] }) => {
  // State for sorting
  const [sortField, setSortField] = useState("invoiceNumber");
  const [sortDirection, setSortDirection] = useState("asc");

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Render sort indicator
  const renderSortIndicator = (field) => {
    if (sortField !== field) return null;

    return <span className="ml-1">{sortDirection === "asc" ? "▲" : "▼"}</span>;
  };

  // Sort the data
  const sortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return [...data].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle special cases for date sorting
      if (sortField === "date" || sortField === "dueDate") {
        // Convert date strings to Date objects for comparison
        const aDate = aValue ? new Date(aValue) : new Date(0);
        const bDate = bValue ? new Date(bValue) : new Date(0);

        return sortDirection === "asc" ? aDate - bDate : bDate - aDate;
      }

      // Convert to strings for standard comparison
      aValue = aValue?.toString().toLowerCase() || "";
      bValue = bValue?.toString().toLowerCase() || "";

      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }, [data, sortField, sortDirection]);

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "—";

    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // If no data, show empty message
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No invoices available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Invoice Number */}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("invoiceNumber")}
            >
              <div className="flex items-center">
                Invoice #{renderSortIndicator("invoiceNumber")}
              </div>
            </th>

            {/* Date */}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("date")}
            >
              <div className="flex items-center">
                Date
                {renderSortIndicator("date")}
              </div>
            </th>

            {/* Due Date */}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("dueDate")}
            >
              <div className="flex items-center">
                Due Date
                {renderSortIndicator("dueDate")}
              </div>
            </th>

            {/* Amount */}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("amount")}
            >
              <div className="flex items-center">
                Amount
                {renderSortIndicator("amount")}
              </div>
            </th>

            {/* Status */}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center">
                Status
                {renderSortIndicator("status")}
              </div>
            </th>

            {/* Actions */}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-gray-50">
              {/* Invoice Number */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {invoice.invoiceNumber || "—"}
                </div>
              </td>

              {/* Date */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {invoice.date
                    ? formatDateToString(new Date(invoice.date))
                    : "—"}
                </div>
              </td>

              {/* Due Date */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {invoice.dueDate
                    ? formatDateToString(new Date(invoice.dueDate))
                    : "—"}
                </div>
              </td>

              {/* Amount */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatCurrency(invoice.amount)}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : invoice.status === "overdue"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {invoice.status
                    ? invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)
                    : "Unknown"}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a
                  href={`/invoices/${invoice.id}`}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;
