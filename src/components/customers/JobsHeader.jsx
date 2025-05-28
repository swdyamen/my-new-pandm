// src/components/customer/JobsHeader.jsx
import IconSearch from "../icons/IconSearch";
import IconPlus from "../icons/IconPlus";

/**
 * JobsHeader Component
 * Contains the title, search functionality, and action buttons for jobs management
 * Provides quick access to add jobs and search through existing jobs
 *
 * @param {Object} props - Component props
 * @param {string} props.search - Current search term
 * @param {Function} props.setSearch - Function to update search term
 * @param {Function} props.onAddJob - Function to add a job with today's date
 * @param {Function} props.onOpenModal - Function to open the job creation modal
 */
const JobsHeader = ({ search, setSearch, onAddJob, onOpenModal }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Jobs Management</h2>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {/* Action Buttons Group */}
        <div className="flex gap-3">
          {/* Quick Add Job Button - Adds job with today's date */}
          <button
            type="button"
            className="btn flex items-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            onClick={onAddJob}
            title="Quickly add a job with today's date"
          >
            <IconPlus className="w-5 h-5 mr-2" />
            Quick Add
          </button>

          {/* Custom Add Job Button - Opens modal for detailed entry */}
          <button
            type="button"
            className="btn flex items-center px-4 py-2.5 bg-white text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            onClick={onOpenModal}
            title="Add a job with custom details"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Job
          </button>

          {/* Future: Show Invoices Button - Uncomment when invoice feature is ready */}
          {/* 
          <button 
            type="button" 
            className="btn flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
            onClick={() => setInvoicesModal(true)}
            title="View customer invoices"
          >
            <IconEye className="w-5 h-5 mr-2" />
            Invoices
          </button> 
          */}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search jobs by date..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Search Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <IconSearch className="w-5 h-5" />
          </div>

          {/* Clear Search Button */}
          {search && (
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsHeader;
