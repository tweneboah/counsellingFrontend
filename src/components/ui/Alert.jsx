import React, { useState, useEffect } from "react";
import {
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";
import { IconButton } from "./";

/**
 * Alert component for displaying notifications and messages
 *
 * @param {Object} props
 * @param {string} props.type - Alert type: 'success', 'error', 'warning', 'info'
 * @param {string} props.title - Optional alert title
 * @param {React.ReactNode} props.children - Alert content/message
 * @param {boolean} props.dismissible - Whether the alert can be dismissed
 * @param {function} props.onDismiss - Function to call when the alert is dismissed
 * @param {number} props.autoHideDuration - Auto-dismiss after duration in ms (0 to disable)
 */
const Alert = ({
  type = "info",
  title,
  children,
  dismissible = true,
  onDismiss,
  autoHideDuration = 0,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!visible) return null;

  // Alert configurations based on type
  const alertConfig = {
    success: {
      icon: <FiCheckCircle className="h-5 w-5" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-400",
      textColor: "text-green-800",
      iconColor: "text-green-400",
    },
    error: {
      icon: <FiAlertCircle className="h-5 w-5" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      textColor: "text-red-800",
      iconColor: "text-red-400",
    },
    warning: {
      icon: <FiAlertTriangle className="h-5 w-5" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-400",
    },
    info: {
      icon: <FiInfo className="h-5 w-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-800",
      iconColor: "text-blue-400",
    },
  };

  const config = alertConfig[type] || alertConfig.info;

  return (
    <div
      className={`rounded-md p-4 border ${config.bgColor} ${config.borderColor} mb-4`}
      role="alert"
    >
      <div className="flex">
        <div className={`flex-shrink-0 ${config.iconColor}`}>{config.icon}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${config.textColor}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${config.textColor} mt-1`}>{children}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <IconButton
              icon={<FiX className="h-5 w-5" />}
              label="Dismiss"
              onClick={handleDismiss}
              className={config.textColor}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
