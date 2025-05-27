// src/components/jobs/JobTable.jsx
import React from "react";
import IconEdit from "../../icons/IconEdit";
import IconTrash from "../../icons/IconTrash";
import IconClipboard from "../../icons/IconClipboard";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { motion, AnimatePresence } from "framer-motion";

const JobStatusBadge = ({ status }) => {
  let colorClass = "";

  switch (status) {
    case "pending":
      colorClass =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      break;
    case "in-progress":
      colorClass =
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      break;
    case "completed":
      colorClass =
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      break;
    case "cancelled":
      colorClass = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      break;
    default:
      colorClass =
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const JobTable = ({ jobs, loading, error, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 flex justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div className="flex flex-col items-center">
          <IconClipboard className="w-16 h-16 text-red-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            Error Loading Jobs
          </h3>
          <p className="mt-2 text-red-500">
            {error.message || "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div className="flex flex-col items-center">
          <IconClipboard className="w-16 h-16 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No Jobs Found
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            This customer doesn't have any jobs yet. Add a new job to get
            started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Job ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <AnimatePresence>
              {jobs.map((job) => (
                <motion.tr
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {job.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {job.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(job.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <JobStatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatCurrency(job.total)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onEdit(job)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition p-1"
                        title="Edit job"
                      >
                        <IconEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(job)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition p-1"
                        title="Delete job"
                      >
                        <IconTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobTable;
