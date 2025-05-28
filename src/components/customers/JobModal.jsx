// src/components/customer/JobModal.jsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../icons/IconX";

/**
 * JobModal Component
 * Modal dialog for adding and editing job information
 * Contains form fields for all job properties with proper validation
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Object} props.params - Current job parameters/form data
 * @param {Function} props.onInputChange - Function to handle input changes
 * @param {Function} props.onSave - Function to save the job
 */
const JobModal = ({ isOpen, onClose, params, onInputChange, onSave }) => {
  /**
   * Handle form submission
   * Prevents default form submission and calls onSave
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  /**
   * Convert date from DD/MM/YYYY to YYYY-MM-DD format for date input
   * @param {string} dateString - Date in DD/MM/YYYY format
   * @returns {string} - Date in YYYY-MM-DD format
   */
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";

    try {
      // If already in YYYY-MM-DD format, return as is
      if (dateString.includes("-") && dateString.indexOf("-") === 4) {
        return dateString;
      }

      // Convert DD/MM/YYYY to YYYY-MM-DD
      if (dateString.includes("/")) {
        const [day, month, year] = dateString.split("/");
        return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      }

      return dateString;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  /**
   * Handle date input change
   * Converts from YYYY-MM-DD to DD/MM/YYYY format
   * @param {Event} e - Input change event
   */
  const handleDateChange = (e) => {
    const value = e.target.value;
    if (!value) return;

    try {
      const date = new Date(value);
      const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      onInputChange({ target: { id: "date", value: formattedDate } });
    } catch (error) {
      console.error("Error handling date change:", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Modal Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
                  <Dialog.Title className="text-xl font-semibold text-white">
                    {params.id ? "Edit Job Details" : "Add New Job"}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-indigo-100 hover:text-white focus:outline-none transition-colors duration-200"
                  >
                    <IconX className="h-6 w-6" />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-6">
                    {/* Date Field */}
                    <div className="mb-6">
                      <label
                        htmlFor="date"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Job Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        required
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                        value={formatDateForInput(params.date)}
                        onChange={handleDateChange}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Select the date when this job was completed
                      </p>
                    </div>

                    {/* Floor Preparation Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Floor Preparation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Has Underlay */}
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <input
                            id="hasUnderlay"
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={params.hasUnderlay}
                            onChange={onInputChange}
                          />
                          <label
                            htmlFor="hasUnderlay"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Has Underlay
                          </label>
                        </div>

                        {/* Has Grippers */}
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <input
                            id="hasGrippers"
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={params.hasGrippers}
                            onChange={onInputChange}
                          />
                          <label
                            htmlFor="hasGrippers"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Has Grippers
                          </label>
                        </div>

                        {/* Floor Is Good */}
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <input
                            id="floorIsGood"
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={params.floorIsGood}
                            onChange={onInputChange}
                          />
                          <label
                            htmlFor="floorIsGood"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Floor Condition is Good
                          </label>
                        </div>

                        {/* Old Flooring Removed */}
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <input
                            id="oldFlooringRemoved"
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={params.oldFlooringRemoved}
                            onChange={onInputChange}
                          />
                          <label
                            htmlFor="oldFlooringRemoved"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Old Flooring Removed
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Work Requirements Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Work Requirements
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Furniture Removal */}
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <input
                            id="furnitureRemoval"
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={params.furnitureRemoval}
                            onChange={onInputChange}
                          />
                          <label
                            htmlFor="furnitureRemoval"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Furniture Removal Required
                          </label>
                        </div>

                        {/* Concrete */}
                        <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                          <input
                            id="concrete"
                            type="checkbox"
                            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={params.concrete}
                            onChange={onInputChange}
                          />
                          <label
                            htmlFor="concrete"
                            className="ml-3 block text-sm font-medium text-gray-700"
                          >
                            Concrete Work Required
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Numeric Inputs Section */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Additional Requirements
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Doors Need Cutting */}
                        <div>
                          <label
                            htmlFor="doorsNeedCutting"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Number of Doors Needing Cutting
                          </label>
                          <input
                            type="number"
                            id="doorsNeedCutting"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                            min="0"
                            max="50"
                            value={params.doorsNeedCutting}
                            onChange={onInputChange}
                          />
                        </div>

                        {/* Door Plates Needed */}
                        <div>
                          <label
                            htmlFor="numberOfDoorPlateNeeded"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                          >
                            Number of Door Plates Needed
                          </label>
                          <input
                            type="number"
                            id="numberOfDoorPlateNeeded"
                            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                            min="0"
                            max="50"
                            value={params.numberOfDoorPlateNeeded}
                            onChange={onInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div>
                      <label
                        htmlFor="comments"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Job Comments & Notes
                      </label>
                      <textarea
                        id="comments"
                        rows={4}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none transition-all duration-200"
                        placeholder="Enter any additional notes, special requirements, or observations about this job..."
                        value={params.comments}
                        onChange={onInputChange}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Add any special instructions or notes for future
                        reference
                      </p>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 mt-6 -mx-6 -mb-6 rounded-b-xl">
                    <button
                      type="button"
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      {params.id ? "Update Job" : "Create Job"}
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

export default JobModal;
