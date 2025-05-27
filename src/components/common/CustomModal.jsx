// src/components/common/CustomModal.jsx
import { useEffect, useRef } from "react";
import IconX from "../../icons/IconX";

/**
 * Custom Modal Component
 * A lightweight alternative to Headless UI Dialog that doesn't rely on external libraries
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {ReactNode} props.title - Title of the modal
 * @param {ReactNode} props.children - Content of the modal
 * @param {string} props.size - Size of the modal ('sm', 'md', 'lg', 'xl', '2xl')
 * @param {boolean} props.showCloseButton - Whether to show the close button
 */
const CustomModal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  const modalRef = useRef(null);
  const initialFocusRef = useRef(null);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (isOpen && e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Focus management - focus first focusable element when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Find all focusable elements in the modal
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      // Focus the first one
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        initialFocusRef.current = document.activeElement;
        firstElement.focus();
      }
    }

    // Restore focus on unmount
    return () => {
      if (initialFocusRef.current) {
        initialFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Trap focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If shift + tab and on first element, move to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }

      // If tab and on last element, move to first element
      else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleTabKey);

    return () => {
      document.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Size mapping for modal width
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"></div>

      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center px-4 py-8">
        {/* Modal panel */}
        <div
          ref={modalRef}
          className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl overflow-hidden transform transition-all`}
          onClick={(e) => e.stopPropagation()}
          style={{
            animation: "fadeInScale 0.3s ease-out forwards",
          }}
        >
          {/* Close button */}
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1"
              aria-label="Close"
            >
              <IconX className="w-5 h-5" />
            </button>
          )}

          {/* Modal header */}
          {title && (
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2
                id="modal-title"
                className="text-lg font-medium text-gray-900"
              >
                {title}
              </h2>
            </div>
          )}

          {/* Modal content */}
          <div className={title ? "p-6" : "p-0"}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
