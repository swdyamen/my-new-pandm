// src/components/customer/JobsTable.jsx
import JobRow from "./JobRow";

/**
 * JobsTable Component
 * Displays jobs in a responsive table format
 * Includes table headers and renders individual job rows
 *
 * @param {Object} props - Component props
 * @param {Array} props.jobs - Array of job objects to display
 * @param {Function} props.onEditJob - Function to handle job editing
 * @param {Function} props.onDeleteJob - Function to handle job deletion
 * @param {string} props.customerId - Customer ID for generating detail links
 */
const JobsTable = ({ jobs, onEditJob, onDeleteJob, customerId }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {/* Date Column */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
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
                  Date
                </div>
              </th>

              {/* Floor Preparation Columns */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Has Underlay
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Has Grippers
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Floor Condition
              </th>

              {/* Work Requirements Columns */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Furniture Removal
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                    />
                  </svg>
                  Doors to Cut
                </div>
              </th>

              {/* Comments Column */}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                    />
                  </svg>
                  Comments
                </div>
              </th>

              {/* Actions Column */}
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map((job, index) => (
              <JobRow
                key={job.id || index}
                job={job}
                onEdit={() => onEditJob(job)}
                onDelete={() => onDeleteJob(job)}
                customerId={customerId}
                isEven={index % 2 === 0}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Summary */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing <span className="font-medium">{jobs.length}</span> job
            {jobs.length !== 1 ? "s" : ""}
          </div>

          {/* Summary Statistics */}
          <div className="flex gap-4">
            <span>
              Active:{" "}
              <span className="font-medium text-green-600">
                {jobs.filter((job) => job.floorIsGood).length}
              </span>
            </span>
            <span>
              Require Work:{" "}
              <span className="font-medium text-amber-600">
                {jobs.filter((job) => !job.floorIsGood).length}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsTable;
