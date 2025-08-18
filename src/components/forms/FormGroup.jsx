import React from "react";

/**
 * A component for grouping form elements with consistent layout
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form elements
 * @param {string} props.className - Additional classes
 * @param {string} props.layout - Layout style: 'vertical' (default) or 'horizontal'
 */
const FormGroup = ({ children, className = "", layout = "vertical" }) => {
  const layoutClasses = {
    vertical: "flex flex-col space-y-4",
    horizontal: "sm:flex sm:items-start sm:space-x-4",
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>{children}</div>
  );
};

export default FormGroup;
