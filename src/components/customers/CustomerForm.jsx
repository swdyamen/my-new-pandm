// src/components/customers/CustomerForm.jsx
import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import IconX from "../../components/icons/IconX";

// Default customer object with empty values
const defaultCustomer = {
  id: null,
  name: "",
  email: "",
  phone: "",
  location: "", // Primary address
  billingAddress: "", // Billing address field
  postCode: "",
};

/**
 * Customer Form Modal Component
 * Provides UI for adding and editing customer information
 * Includes both primary and billing address handling
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Controls modal visibility
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Object|null} props.customer - Customer data for editing, null for new customer
 * @param {Function} props.onSave - Function to call when saving the customer
 */
const CustomerForm = ({ isOpen, onClose, customer, onSave }) => {
  // State for form data
  const [formData, setFormData] = useState({ ...defaultCustomer });
  // State for validation errors
  const [errors, setErrors] = useState({});
  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  // State to track if billing address is same as primary address
  const [sameAsPrimary, setSameAsPrimary] = useState(true);

  // Reset form when customer changes or modal opens/closes
  useEffect(() => {
    if (isOpen) {
      if (customer) {
        // If editing existing customer
        setFormData({
          ...customer,
          // If customer has no billing address, initialize it
          billingAddress: customer.billingAddress || "",
        });
        // If customer has a billing address different from primary, uncheck the "same as" box
        setSameAsPrimary(
          !customer.billingAddress ||
            customer.billingAddress === customer.location
        );
      } else {
        // If adding new customer
        setFormData({ ...defaultCustomer });
        setSameAsPrimary(true);
      }
      // Clear any previous errors
      setErrors({});
    }
  }, [isOpen, customer]);

  /**
   * Handle input field changes
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    const { id, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [id]: value }));

    // If changing primary address and "same as" is checked, update billing too
    if (id === "location" && sameAsPrimary) {
      setFormData((prev) => ({ ...prev, [id]: value, billingAddress: value }));
    }

    // Clear error for this field if it exists
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  /**
   * Handle "same as primary address" checkbox
   * @param {Object} e - Event object
   */
  const handleSameAddressChange = (e) => {
    const checked = e.target.checked;
    setSameAsPrimary(checked);

    if (checked) {
      // If checked, copy primary address to billing address
      setFormData((prev) => ({
        ...prev,
        billingAddress: prev.location,
      }));
    }
  };

  /**
   * Validate form before submission
   * @returns {boolean} - True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};

    // Name is required
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email is optional but must be valid if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone is required and must be valid
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 11 digits";
    }

    // Address is required
    if (!formData.location.trim()) {
      newErrors.location = "Address is required";
    }

    // Post code is required
    if (!formData.postCode.trim()) {
      newErrors.postCode = "Post code is required";
    }

    // Billing address is required if not same as primary
    if (!sameAsPrimary && !formData.billingAddress.trim()) {
      newErrors.billingAddress = "Billing address is required";
    }

    setErrors(newErrors);

    // Form is valid if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // If billing address is same as primary, ensure they match
      const customerData = {
        ...formData,
        billingAddress: sameAsPrimary
          ? formData.location
          : formData.billingAddress,
      };

      await onSave(customerData);
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
      setErrors((prev) => ({
        ...prev,
        general: "Failed to save customer. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use a custom modal implementation if the Headless UI approach doesn't work
  if (!isOpen) return null;

  // Custom modal implementation as fallback
  const CustomModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
            aria-label="Close"
          >
            <IconX className="w-5 h-5" />
          </button>

          {/* Modal header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {formData.id ? "Edit Customer" : "Add Customer"}
            </h2>
          </div>

          {/* Modal content */}
          <div className="p-6">
            {/* General error message */}
            {errors.general && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                <p>{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Customer details section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name field */}
                  <div className="col-span-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter customer name"
                      className={`w-full rounded-md border ${
                        errors.name ? "border-red-300" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email field - optional */}
                  <div className="col-span-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email{" "}
                      <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      className={`w-full rounded-md border ${
                        errors.email ? "border-red-300" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone field */}
                  <div className="col-span-1">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="text"
                      placeholder="Enter 11-digit phone number"
                      className={`w-full rounded-md border ${
                        errors.phone ? "border-red-300" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={11}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Post code field */}
                  <div className="col-span-1">
                    <label
                      htmlFor="postCode"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Post Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="postCode"
                      type="text"
                      placeholder="Enter post code"
                      className={`w-full rounded-md border ${
                        errors.postCode ? "border-red-300" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                      value={formData.postCode}
                      onChange={handleChange}
                    />
                    {errors.postCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.postCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Address Information
                </h3>

                {/* Primary address */}
                <div className="mb-4">
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Primary Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="location"
                    rows={3}
                    placeholder="Enter complete address"
                    className={`w-full rounded-md border ${
                      errors.location ? "border-red-300" : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none`}
                    value={formData.location}
                    onChange={handleChange}
                  ></textarea>
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Same as primary checkbox */}
                <div className="mb-3 flex items-center">
                  <input
                    id="sameAsPrimary"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={sameAsPrimary}
                    onChange={handleSameAddressChange}
                  />
                  <label
                    htmlFor="sameAsPrimary"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Billing address is the same as primary address
                  </label>
                </div>

                {/* Billing address - conditional rendering */}
                {!sameAsPrimary && (
                  <div>
                    <label
                      htmlFor="billingAddress"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Billing Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="billingAddress"
                      rows={3}
                      placeholder="Enter billing address"
                      className={`w-full rounded-md border ${
                        errors.billingAddress
                          ? "border-red-300"
                          : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none`}
                      value={formData.billingAddress}
                      onChange={handleChange}
                    ></textarea>
                    {errors.billingAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.billingAddress}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Form actions */}
              <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
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
                      {formData.id ? "Updating..." : "Saving..."}
                    </span>
                  ) : (
                    <span>
                      {formData.id ? "Update Customer" : "Add Customer"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Try first with the Headless UI approach, with fallback to custom implementation
  try {
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          {/* Backdrop overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          {/* Modal container */}
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden">
                  {/* Close button */}
                  <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                    aria-label="Close"
                  >
                    <IconX className="w-5 h-5" />
                  </button>

                  {/* Modal header */}
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      {formData.id ? "Edit Customer" : "Add Customer"}
                    </h2>
                  </div>

                  {/* Modal content */}
                  <div className="p-6">
                    {/* General error message */}
                    {errors.general && (
                      <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                        <p>{errors.general}</p>
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      {/* Customer details section */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Customer Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name field */}
                          <div className="col-span-1">
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="name"
                              type="text"
                              placeholder="Enter customer name"
                              className={`w-full rounded-md border ${
                                errors.name
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                              value={formData.name}
                              onChange={handleChange}
                            />
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                              </p>
                            )}
                          </div>

                          {/* Email field - optional */}
                          <div className="col-span-1">
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Email{" "}
                              <span className="text-gray-400 text-xs">
                                (optional)
                              </span>
                            </label>
                            <input
                              id="email"
                              type="email"
                              placeholder="Enter email address"
                              className={`w-full rounded-md border ${
                                errors.email
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                              value={formData.email}
                              onChange={handleChange}
                            />
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                              </p>
                            )}
                          </div>

                          {/* Phone field */}
                          <div className="col-span-1">
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Phone Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="phone"
                              type="text"
                              placeholder="Enter 11-digit phone number"
                              className={`w-full rounded-md border ${
                                errors.phone
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                              value={formData.phone}
                              onChange={handleChange}
                              maxLength={11}
                            />
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.phone}
                              </p>
                            )}
                          </div>

                          {/* Post code field */}
                          <div className="col-span-1">
                            <label
                              htmlFor="postCode"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Post Code <span className="text-red-500">*</span>
                            </label>
                            <input
                              id="postCode"
                              type="text"
                              placeholder="Enter post code"
                              className={`w-full rounded-md border ${
                                errors.postCode
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500`}
                              value={formData.postCode}
                              onChange={handleChange}
                            />
                            {errors.postCode && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.postCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Address section */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">
                          Address Information
                        </h3>

                        {/* Primary address */}
                        <div className="mb-4">
                          <label
                            htmlFor="location"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Primary Address{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="location"
                            rows={3}
                            placeholder="Enter complete address"
                            className={`w-full rounded-md border ${
                              errors.location
                                ? "border-red-300"
                                : "border-gray-300"
                            } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none`}
                            value={formData.location}
                            onChange={handleChange}
                          ></textarea>
                          {errors.location && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.location}
                            </p>
                          )}
                        </div>

                        {/* Same as primary checkbox */}
                        <div className="mb-3 flex items-center">
                          <input
                            id="sameAsPrimary"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            checked={sameAsPrimary}
                            onChange={handleSameAddressChange}
                          />
                          <label
                            htmlFor="sameAsPrimary"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Billing address is the same as primary address
                          </label>
                        </div>

                        {/* Billing address - conditional rendering */}
                        {!sameAsPrimary && (
                          <div>
                            <label
                              htmlFor="billingAddress"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Billing Address{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id="billingAddress"
                              rows={3}
                              placeholder="Enter billing address"
                              className={`w-full rounded-md border ${
                                errors.billingAddress
                                  ? "border-red-300"
                                  : "border-gray-300"
                              } px-3 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none`}
                              value={formData.billingAddress}
                              onChange={handleChange}
                            ></textarea>
                            {errors.billingAddress && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.billingAddress}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Form actions */}
                      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4 mt-6">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                            isSubmitting
                              ? "bg-indigo-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          }`}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
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
                              {formData.id ? "Updating..." : "Saving..."}
                            </span>
                          ) : (
                            <span>
                              {formData.id ? "Update Customer" : "Add Customer"}
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  } catch (error) {
    // If Headless UI fails, fall back to the custom implementation
    console.error("Headless UI error:", error);
    return <CustomModal />;
  }
};

export default CustomerForm;
