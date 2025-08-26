import React from "react";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiX } from "react-icons/fi";
import Modal from "./Modal";
import Button from "./Button";

/**
 * Confirmation Modal component for displaying confirmation dialogs
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {function} props.onConfirm - Function to call when confirmed
 * @param {string} props.title - Confirmation dialog title
 * @param {string} props.message - Confirmation message content
 * @param {string} props.confirmText - Text for the confirm button
 * @param {string} props.cancelText - Text for the cancel button
 * @param {string} props.variant - Variant style: 'danger', 'warning', 'info'
 * @param {boolean} props.isLoading - Whether the confirm action is loading
 */
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        };
      case "warning":
        return {
          iconColor: "text-yellow-500",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          confirmButton: "bg-yellow-600 hover:bg-yellow-700 text-white",
        };
      case "info":
        return {
          iconColor: "text-blue-500",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white",
        };
      default:
        return {
          iconColor: "text-red-500",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          confirmButton: "bg-red-600 hover:bg-red-700 text-white",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={null}
      size="md"
      closeOnClickOutside={!isLoading}
    >
      <div className="text-center py-6 px-6">
        {/* Warning Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.1 
          }}
          className="mx-auto mb-6"
        >
          <div className={`w-16 h-16 ${styles.bgColor} ${styles.borderColor} border-2 rounded-full flex items-center justify-center mx-auto`}>
            <FiAlertTriangle className={`w-8 h-8 ${styles.iconColor}`} />
          </div>
        </motion.div>

        {/* Confirmation Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {message}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-4 justify-center"
        >
          <Button
            onClick={onClose}
            variant="outline"
            disabled={isLoading}
            className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
            className={`px-6 py-2 ${styles.confirmButton} border-0 shadow-md hover:shadow-lg transition-all duration-200`}
          >
            {confirmText}
          </Button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;