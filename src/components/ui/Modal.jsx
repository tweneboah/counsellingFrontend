import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import { IconButton } from "./";

/**
 * Modal component for displaying dialogs, confirmations, or forms
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {string} props.title - Modal title (null to hide header)
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Optional footer content (usually buttons)
 * @param {string} props.size - Modal size: 'sm', 'md' (default), 'lg', or 'xl'
 * @param {boolean} props.closeOnClickOutside - Whether to close when clicking outside
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnClickOutside = true,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Size classes
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    "4xl": "max-w-4xl",
    full: "max-w-full mx-4",
  };

  const handleBackdropClick = (e) => {
    if (closeOnClickOutside && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex justify-center items-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header - only show if title is provided */}
        {title !== null && (
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <IconButton
              icon={<FiX />}
              label="Close modal"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            />
          </div>
        )}

        {/* Body */}
        <div className={title !== null ? "px-6 py-4" : ""}>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
