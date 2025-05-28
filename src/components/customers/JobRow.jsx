// src/components/customer/JobRow.jsx

/**
 * JobRow Component
 * Renders a single job row in the jobs table
 * Displays job information with proper formatting and action buttons
 *
 * @param {Object} props - Component props
 * @param {Object} props.job - Job data object
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {string} props.customerId - Customer ID for generating detail links
 * @param {boolean} props.isEven - Whether this is an even-numbered row (for styling)
 */
const JobRow = ({ job, onEdit, onDelete, customerId, isEven }) => {
  /**
   * Create status badge component for boolean values
   * @param {boolean} status - The status value
   * @param {string} trueText - Text to show when true (default: "Yes")
   * @param {string} falseText - Text to show when false (default: "No")
   */
  const StatusBadge = ({ status, trueText = "Yes", falseText = "No" }) => (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
        status
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200"
      }`}
    >
      {status ? trueText : falseText}
    </span>
  );

  /**
   * Format date for better display
   * @param {string} dateString - Date string to format
   */
  const formatDate = (dateString) => {
    if (!dateString) return "No date";

    // If already in DD/MM/YYYY format, return as is
    if (dateString.includes("/")) {
      return dateString;
    }

    // Try to parse and format if it's in another format
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <tr
      className={`hover:bg-gray-50 transition-colors duration-150 ${
        isEven ? "bg-white" : "bg-gray-25"
      }`}
    >
      {/* Date Cell */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-indigo-600"
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
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-gray-900">
              {formatDate(job.date)}
            </div>
          </div>
        </div>
      </td>

      {/* Has Underlay Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={job.hasUnderlay} />
      </td>

      {/* Has Grippers Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={job.hasGrippers} />
      </td>

      {/* Floor Condition Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge
          status={job.floorIsGood}
          trueText="Good"
          falseText="Needs Work"
        />
      </td>

      {/* Furniture Removal Status */}
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge
          status={job.furnitureRemoval}
          trueText="Required"
          falseText="Not Required"
        />
      </td>

      {/* Doors Need Cutting Count */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {job.doorsNeedCutting > 0 ? (
            <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium border border-amber-200">
              {job.doorsNeedCutting} door{job.doorsNeedCutting !== 1 ? "s" : ""}
            </span>
          ) : (
            <span className="text-gray-500 text-sm">None</span>
          )}
        </div>
      </td>

      {/* Comments Cell */}
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900 max-w-xs">
          {job.comments ? (
            <div className="truncate" title={job.comments}>
              {job.comments}
            </div>
          ) : (
            <span className="text-gray-500 italic">No comments</span>
          )}
        </div>
      </td>

      {/* Actions Cell */}
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex justify-center space-x-2">
          {/* Edit Button */}
          <button
            type="button"
            onClick={onEdit}
            className="text-indigo-600 hover:text-indigo-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-indigo-50 transition-colors duration-150 border border-transparent hover:border-indigo-200"
            title="Edit this job"
          >
            Edit
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={onDelete}
            className="text-red-600 hover:text-red-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-red-50 transition-colors duration-150 border border-transparent hover:border-red-200"
            title="Delete this job"
          >
            Delete
          </button>

          {/* Details Link */}
          <a
            href={`/customers/${customerId}/jobs/${job.id}/rooms`}
            className="text-green-600 hover:text-green-900 font-medium text-sm px-3 py-1 rounded-md hover:bg-green-50 transition-colors duration-150 border border-transparent hover:border-green-200"
            title="View job details and rooms"
          >
            Details
          </a>
        </div>
      </td>
    </tr>
  );
};

export default JobRow;
