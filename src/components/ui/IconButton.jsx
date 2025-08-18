import React from "react";

/**
 * A reusable icon button component
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {string} props.className - Additional classes
 * @param {string} props.label - Accessible label for the button (for screen readers)
 * @param {'primary'|'secondary'|'outline'|'text'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.type - Button type attribute
 */
const IconButton = ({
  icon,
  className = "",
  label,
  variant = "text",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
  ...props
}) => {
  // Base classes
  const baseClasses =
    "rounded-full flex items-center justify-center focus:outline-none transition-colors";

  // Variant classes
  const variantClasses = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline:
      "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-100",
    text: "bg-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100",
  };

  // Size classes
  const sizeClasses = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  // Icon size classes
  const iconSizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  // Disabled classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {React.cloneElement(icon, {
        className: `${iconSizeClasses[size]} ${icon.props.className || ""}`,
      })}
    </button>
  );
};

export default IconButton;
