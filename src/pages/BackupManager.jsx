// src/pages/BackupManager.jsx
import { useState, useEffect } from "react";
import { format } from "date-fns";
import Swal from "sweetalert2";
import {
  createBackup,
  restoreFromBackup,
  getAvailableBackups,
} from "../utils/firebaseBackup";

/**
 * Backup Manager component
 * Provides a user interface for managing Firebase data backups
 */
const BackupManager = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);

  // Load available backups on component mount
  useEffect(() => {
    loadBackups();
  }, []);

  /**
   * Load available backups
   */
  const loadBackups = async () => {
    setLoading(true);
    try {
      const availableBackups = await getAvailableBackups();
      setBackups(availableBackups);
    } catch (error) {
      console.error("Error loading backups:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to load backups: ${error.message}`,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new backup
   */
  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      // Ask for confirmation
      const result = await Swal.fire({
        title: "Create Backup",
        text: "Are you sure you want to create a new backup?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, create backup",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        // Show processing indicator
        Swal.fire({
          title: "Creating Backup",
          text: "This may take a moment...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Create the backup
        const backupDir = await createBackup();

        // Show success message
        Swal.fire({
          title: "Backup Created",
          text: `Backup saved to: ${backupDir}`,
          icon: "success",
        });

        // Refresh the backup list
        await loadBackups();
      }
    } catch (error) {
      console.error("Error creating backup:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to create backup: ${error.message}`,
        icon: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  /**
   * Restore from a selected backup
   */
  const handleRestoreBackup = async () => {
    if (!selectedBackup) {
      Swal.fire({
        title: "No Backup Selected",
        text: "Please select a backup to restore from",
        icon: "warning",
      });
      return;
    }

    setRestoring(true);
    try {
      // Ask for confirmation with clear option
      const result = await Swal.fire({
        title: "Restore Backup",
        html: `
          <p>Are you sure you want to restore from this backup?</p>
          <p class="text-sm text-gray-500 mt-2">Backup from: ${format(
            new Date(selectedBackup.createdAt),
            "PPpp"
          )}</p>
          <div class="mt-4">
            <label class="inline-flex items-center">
              <input type="checkbox" id="clear-checkbox" class="form-checkbox h-5 w-5 text-indigo-600">
              <span class="ml-2">Clear existing data before restore</span>
            </label>
          </div>
          <p class="text-sm text-red-500 mt-1">Warning: This will overwrite current data!</p>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, restore backup",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          return document.getElementById("clear-checkbox").checked;
        },
      });

      if (result.isConfirmed) {
        const clearBeforeRestore = result.value;

        // Show processing indicator
        Swal.fire({
          title: "Restoring Backup",
          text: "This may take a moment...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        // Restore from backup
        await restoreFromBackup(selectedBackup.path, clearBeforeRestore);

        // Show success message
        Swal.fire({
          title: "Restore Complete",
          text: "Data has been restored successfully",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to restore backup: ${error.message}`,
        icon: "error",
      });
    } finally {
      setRestoring(false);
    }
  };

  /**
   * Delete a backup
   * @param {Object} backup - Backup to delete
   */
  const handleDeleteBackup = async (backup) => {
    try {
      // Ask for confirmation
      const result = await Swal.fire({
        title: "Delete Backup",
        text: "Are you sure you want to delete this backup? This cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        // Implementation would need file system access
        // This would be implemented in a Node.js context
        Swal.fire({
          title: "Not Implemented",
          text: "Backup deletion is not implemented in the browser. Please delete manually.",
          icon: "info",
        });
      }
    } catch (error) {
      console.error("Error deleting backup:", error);
      Swal.fire({
        title: "Error",
        text: `Failed to delete backup: ${error.message}`,
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Firebase Backup Manager
        </h1>
        <button
          onClick={handleCreateBackup}
          disabled={creating}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create New Backup"}
        </button>
      </div>

      {/* Description */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Create, manage, and restore backups of your Firebase data. Backups
              help protect against data loss and allow you to restore to a
              previous state if needed.
            </p>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Available Backups
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Select a backup to view details or restore
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="p-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && backups.length === 0 && (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No backups found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first backup to protect your data
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={handleCreateBackup}
                disabled={creating}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {creating ? "Creating..." : "Create New Backup"}
              </button>
            </div>
          </div>
        )}

        {/* Backup list */}
        {!loading && backups.length > 0 && (
          <div className="flex flex-col md:flex-row">
            {/* Backup list */}
            <div className="w-full md:w-1/3 border-r border-gray-200">
              <ul className="divide-y divide-gray-200">
                {backups.map((backup, index) => (
                  <li
                    key={index}
                    className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                      selectedBackup === backup ? "bg-indigo-50" : ""
                    }`}
                    onClick={() => setSelectedBackup(backup)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-6 w-6 text-indigo-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          Backup {index + 1}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(backup.createdAt), "PP")}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Backup details */}
            <div className="w-full md:w-2/3 p-6">
              {selectedBackup ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Backup Details
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Created At
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {format(new Date(selectedBackup.createdAt), "PPpp")}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Backup Path
                          </dt>
                          <dd
                            className="mt-1 text-sm text-gray-900 truncate"
                            title={selectedBackup.path}
                          >
                            {selectedBackup.path}
                          </dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">
                            Collections
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <div className="flex flex-wrap gap-2">
                              {selectedBackup.collections.map(
                                (collection, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                  >
                                    {collection}
                                  </span>
                                )
                              )}
                            </div>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleRestoreBackup}
                      disabled={restoring}
                      className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {restoring ? "Restoring..." : "Restore from Backup"}
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(selectedBackup)}
                      className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <p>Select a backup to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackupManager;
