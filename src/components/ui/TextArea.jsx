import React, { forwardRef } from "react";

/**
 * A reusable textarea component
 *
 * @param {Object} props
 * @param {string} props.id - Textarea ID
 * @param {string} props.name - Textarea name
 * @param {string} props.placeholder - Textarea placeholder
 * @param {string} props.label - Label text
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether the textarea is required
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.value - Textarea value
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {string} props.className - Additional classes for the textarea
 * @param {string} props.labelClassName - Additional classes for the label
 * @param {number} props.rows - Number of rows to display
 * @param {string} props.helpText - Optional help text
 */
const TextArea = forwardRef(
  (
    {
      id,
      name,
      placeholder,
      label,
      error,
      required = false,
      onChange,
      onBlur,
      value,
      disabled = false,
      className = "",
      labelClassName = "",
      rows = 4,
      helpText,
      ...props
    },
    ref
  ) => {
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
        <textarea
          ref={ref}
          id={id}
          name={name}
          rows={rows}
          placeholder={placeholder}
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
        />
        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
