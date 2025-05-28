// src/components/customer/EmptyJobsState.jsx

/**
 * EmptyJobsState Component
 * Displays when no jobs are found for the customer
 * Provides a call-to-action to add the first job
 *
 * @param {Object} props - Component props
 * @param {Function} props.onAddJob - Function to handle adding a new job
 */
const EmptyJobsState = ({ onAddJob }) => {
  return (
    <div className="text-center py-12 px-6">
      {/* Empty State Icon */}
      <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </div>

      {/* Empty State Content */}
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No Jobs Found
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed">
          This customer doesn't have any jobs yet. Get started by creating their
          first job entry to track work progress and requirements.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Primary Add Job Button */}
          <button
            onClick={onAddJob}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
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
            Create First Job
          </button>

          {/* Secondary Help Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-sm"
            onClick={() => {
              // Could open a help modal or navigate to documentation
              alert(
                "Jobs help: Jobs track work requirements like flooring preparation, door cutting, and other customer-specific tasks."
              );
            }}
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            What are Jobs?
          </button>
        </div>
      </div>

      {/* Helpful Tips Section */}
      <div className="mt-10 pt-8 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Quick Tips for Job Management
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <strong>Track Progress:</strong> Monitor floor preparation and
              work requirements
            </div>
          </div>

          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <div>
              <strong>Add Details:</strong> Include comments and special
              requirements
            </div>
          </div>

          <div className="flex items-start">
            <svg
              className="w-4 h-4 text-indigo-500 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <div>
              <strong>Date Tracking:</strong> Record when work was completed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyJobsState;
