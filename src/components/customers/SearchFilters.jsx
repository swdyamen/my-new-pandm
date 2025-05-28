// src/components/customers/SearchFilters.jsx
import React, { useState } from "react";
import IconSearch from "../../components/icons/IconSearch";
import IconX from "../../components/icons/IconX";
import IconFilter from "../../components/icons/IconFilter";

/**
 * Enhanced search filters component with improved UI/UX
 * Provides a collapsible search interface with clear buttons for each filter
 *
 * @param {Object} props - Component props
 * @param {Object} props.filters - Current filter values
 * @param {Function} props.setFilters - Function to update filters
 * @param {Function} props.onClearFilters - Function to clear all filters
 * @returns {JSX.Element} Rendered component
 */
const SearchFilters = ({ filters, setFilters, onClearFilters }) => {
  // State to track if filters are expanded on mobile
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * Handle input changes and update corresponding filter
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Check if any filters are currently applied
   * @returns {boolean} True if any filters are active
   */
  const hasActiveFilters = () => {
    return Object.values(filters).some((value) => value !== "");
  };

  /**
   * Clear a specific filter
   * @param {string} filterName - Name of the filter to clear
   */
  const clearFilter = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: "" }));
  };

  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-sm mb-6 transition-all duration-200">
      {/* Filter header with toggle button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <IconFilter className="w-5 h-5 text-gray-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-800">Search Filters</h2>

          {/* Badge showing active filter count */}
          {hasActiveFilters() && (
            <span className="ml-2 px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
              {Object.values(filters).filter((v) => v !== "").length} active
            </span>
          )}
        </div>

        <div className="flex space-x-2">
          {/* Clear filters button - only show if filters are applied */}
          {hasActiveFilters() && (
            <button
              type="button"
              onClick={onClearFilters}
              className="btn btn-sm px-2 py-1 text-sm border border-gray-300 text-gray-700 bg-white rounded hover:bg-gray-50 flex items-center gap-1 transition-colors"
              aria-label="Clear all filters"
            >
              <IconX className="w-3.5 h-3.5" />
              Clear All
            </button>
          )}

          {/* Toggle filters visibility on mobile */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="filter-inputs"
          >
            <span className="sr-only">
              {isExpanded ? "Hide filters" : "Show filters"}
            </span>
            <svg
              className={`w-5 h-5 transition-transform ${
                isExpanded ? "transform rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter inputs - always visible on desktop, toggleable on mobile */}
      <div
        id="filter-inputs"
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${
          isExpanded ? "block" : "hidden md:grid"
        }`}
      >
        {/* Customer name filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            value={filters.name}
            onChange={handleChange}
            aria-label="Filter by customer name"
          />
          {/* Clear button - only show when filter has a value */}
          {filters.name && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={() => clearFilter("name")}
              aria-label="Clear name filter"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Phone filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            value={filters.phone}
            onChange={handleChange}
            aria-label="Filter by phone number"
          />
          {/* Clear button - only show when filter has a value */}
          {filters.phone && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={() => clearFilter("phone")}
              aria-label="Clear phone filter"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Location filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="location"
            placeholder="Location"
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            value={filters.location}
            onChange={handleChange}
            aria-label="Filter by location"
          />
          {/* Clear button - only show when filter has a value */}
          {filters.location && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={() => clearFilter("location")}
              aria-label="Clear location filter"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Post code filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            name="postCode"
            placeholder="Post Code"
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
            value={filters.postCode}
            onChange={handleChange}
            aria-label="Filter by post code"
          />
          {/* Clear button - only show when filter has a value */}
          {filters.postCode && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 transition-colors"
              onClick={() => clearFilter("postCode")}
              aria-label="Clear post code filter"
            >
              <IconX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Applied filters pills - show on mobile when collapsed */}
      {!isExpanded && hasActiveFilters() && (
        <div className="md:hidden mt-2 flex flex-wrap gap-2">
          {Object.entries(filters).map(
            ([key, value]) =>
              value && (
                <div
                  key={key}
                  className="flex items-center bg-indigo-50 text-indigo-700 rounded-full py-1 px-3 text-xs"
                >
                  <span className="mr-1 capitalize">{key}:</span>
                  <span className="font-medium">{value}</span>
                  <button
                    type="button"
                    className="ml-1 text-indigo-500 hover:text-indigo-700 transition-colors"
                    onClick={() => clearFilter(key)}
                    aria-label={`Remove ${key} filter`}
                  >
                    <IconX className="w-3 h-3" />
                  </button>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
