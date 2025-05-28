// src/components/customer/CustomerHeader.jsx
import IconUser from "../icons/IconUser";

/**
 * CustomerHeader Component
 * Displays customer information in a clean card layout
 * Shows avatar, name, contact details, and location information
 *
 * @param {Object} props - Component props
 * @param {Object} props.customer - Customer data object
 */
const CustomerHeader = ({ customer }) => {
  return (
    <div className="mb-8 bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="p-6 flex flex-col sm:flex-row items-center">
        {/* Customer Avatar Circle */}
        <div className="mb-5 sm:mb-0 w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center shadow-inner">
          <IconUser className="w-12 h-12 text-indigo-600" />
        </div>

        {/* Customer Details Section */}
        <div className="flex-1 sm:ml-6 text-center sm:text-left">
          {/* Customer Name */}
          <h1 className="text-gray-900 text-3xl font-bold mb-3">
            {customer.name || "Customer Name"}
          </h1>

          {/* Contact Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600">
            {/* Email Address */}
            {customer.email && (
              <div className="flex items-center justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm">{customer.email}</span>
              </div>
            )}

            {/* Phone Number */}
            {customer.phone && (
              <div className="flex items-center justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-sm">{customer.phone}</span>
              </div>
            )}

            {/* Post Code */}
            {customer.postCode && (
              <div className="flex items-center justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">{customer.postCode}</span>
              </div>
            )}

            {/* Location/Address */}
            {customer.location && (
              <div className="flex items-center justify-center sm:justify-start">
                <svg
                  className="w-4 h-4 mr-2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <span className="text-sm">{customer.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Status Badge (if available) */}
        {customer.status && (
          <div className="mt-4 sm:mt-0">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                customer.status === "active"
                  ? "bg-green-100 text-green-800"
                  : customer.status === "inactive"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {customer.status.charAt(0).toUpperCase() +
                customer.status.slice(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHeader;
