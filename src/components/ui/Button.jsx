import React from "react";

/**
 * A reusable button component with different variants
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content of the button
 * @param {string} props.className - Additional classes to add
 * @param {'primary'|'secondary'|'outline'|'text'} props.variant - Button style variant
 * @param {'sm'|'md'|'lg'} props.size - Button size
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {Function} props.onClick - Click handler
 * @param {string} props.type - Button type attribute
 * @param {React.ElementType} props.as - Element type to render as (e.g., "button", "a", Link)
 */
const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  disabled = false,
  isLoading = false,
  onClick,
  type = "button",
  as: Component = "button",
  ...props
}) => {
  // Base classes always applied
  const baseClasses =
    "font-medium rounded-md focus:outline-none transition-colors";

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white",
    secondary: "bg-white hover:bg-gray-100 text-cyan-700 shadow-md",
    outline:
      "bg-transparent border border-cyan-600 text-cyan-600 hover:bg-cyan-50",
    text: "bg-transparent text-cyan-600 hover:text-cyan-700 hover:bg-gray-100",
  };

  // Disabled classes
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  // Only add type for button elements
  const buttonProps = Component === "button" ? { type } : {};

  return (
    <Component
      {...buttonProps}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
          Loading...
        </div>
      ) : (
        children
      )}
    </Component>
  );
};

export default Button;
