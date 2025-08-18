import React, { forwardRef } from "react";

/**
 * A reusable select component
 *
 * @param {Object} props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Label text
 * @param {Array} props.options - Array of options (can be simple array of strings or array of {value, label} objects)
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether the select is required
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.value - Selected value
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.className - Additional classes for the select
 * @param {string} props.labelClassName - Additional classes for the label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.helpText - Optional help text
 */
const Select = forwardRef(
  (
    {
      id,
      name,
      label,
      options = [],
      error,
      required = false,
      onChange,
      onBlur,
      value,
      disabled = false,
      className = "",
      labelClassName = "",
      placeholder = "Select an option",
      helpText,
      ...props
    },
    ref
  ) => {
    // Check if options are objects or strings
    const isObjectOptions =
      options.length > 0 && typeof options[0] === "object";

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={id}
            className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          name={name}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          disabled={disabled}
          className={`px-3 py-2 block w-full border rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300"
          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""} ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={isObjectOptions ? option.value : option}>
              {isObjectOptions ? option.label : option}
            </option>
          ))}
        </select>
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
