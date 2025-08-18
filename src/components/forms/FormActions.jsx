import React from "react";

/**
 * A component for form actions (submit, cancel, etc.)
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Action buttons
 * @param {string} props.className - Additional classes
 * @param {string} props.align - Alignment of actions: 'right' (default), 'left', 'center', or 'between'
 */
const FormActions = ({ children, className = "", align = "right" }) => {
  const alignClasses = {
    right: "justify-end",
    left: "justify-start",
    center: "justify-center",
    between: "justify-between",
  };

  return (
    <div
      className={`flex items-center mt-6 space-x-3 ${alignClasses[align]} ${className}`}
    >
      {children}
    </div>
  );
};

export default FormActions;
