import React from "react";

/**
 * A reusable badge component with different variants
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content of the badge
 * @param {string} props.className - Additional classes
 * @param {'primary'|'success'|'warning'|'danger'|'info'} props.variant - Badge style variant
 */
const Badge = ({ children, className = "", variant = "primary" }) => {
  // Base classes
  const baseClasses =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  // Variant classes
  const variantClasses = {
    primary: "bg-cyan-100 text-cyan-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
