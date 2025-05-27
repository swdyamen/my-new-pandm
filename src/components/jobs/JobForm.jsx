// src/components/jobs/JobForm.jsx
import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../icons/IconX";
import { formatDateForInput } from "../../utils/formatters";

const jobStatuses = [
  { id: "pending", name: "Pending" },
  { id: "in-progress", name: "In Progress" },
  { id: "completed", name: "Completed" },
  { id: "cancelled", name: "Cancelled" },
];

const defaultJob = {
  id: null,
  title: "",
  description: "",
  date: formatDateForInput(new Date()),
  status: "pending",
  total: "",
  notes: "",
};

const JobForm = ({ isOpen, onClose, job, onSave }) => {
  const [formData, setFormData] = useState({ ...defaultJob });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (job) {
        // Format the date properly if it exists
        const jobData = {
          ...job,
          date: job.date
            ? formatDateForInput(job.date)
            : formatDateForInput(new Date()),
        };
        setFormData(jobData);
      } else {
        setFormData({ ...defaultJob });
      }
      setErrors({});
    }
  }, [isOpen, job]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;

    // Handle number inputs
    if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [id]: value === "" ? "" : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (formData.total === "" || isNaN(formData.total) || formData.total < 0) {
      newErrors.total = "Valid total amount is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Format the data properly
      const formattedData = {
        ...formData,
        total: parseFloat(formData.total),
        date: new Date(formData.date),
      };

      await onSave(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {job?.id ? "Edit Job" : "Add New Job"}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <IconX className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Job Title *
                      </label>
                      <input
                        type="text"
                        id="title"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.title ? "border-red-500" : ""
                        }`}
                        placeholder="Job Title"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Date *
                        </label>
                        <input
                          type="date"
                          id="date"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                            errors.date ? "border-red-500" : ""
                          }`}
                          value={formData.date}
                          onChange={handleChange}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="status"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          {jobStatuses.map((status) => (
                            <option key={status.id} value={status.id}>
                              {status.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="total"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Total Amount (£) *
                      </label>
                      <input
                        type="number"
                        id="total"
                        step="0.01"
                        min="0"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                          errors.total ? "border-red-500" : ""
                        }`}
                        placeholder="0.00"
                        value={formData.total}
                        onChange={handleChange}
                      />
                      {errors.total && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.total}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Job description"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                    </div>

                    <div>
                      <label
                        htmlFor="notes"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Notes
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Additional notes"
                        value={formData.notes}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        isSubmitting
                          ? "bg-indigo-400 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          {job?.id ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>{job?.id ? "Update Job" : "Create Job"}</>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default JobForm;
