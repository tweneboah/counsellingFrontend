import React from "react";
import { Card } from "../ui";

/**
 * A container for forms with consistent styling
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form content
 * @param {string} props.title - Form title
 * @param {string} props.subtitle - Optional form subtitle or description
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {string} props.className - Additional classes for the form container
 * @param {boolean} props.centered - Whether to center the form on the page
 * @param {string} props.maxWidth - Max width class for the form
 */
const FormContainer = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  centered = true,
  maxWidth = "max-w-md",
}) => {
  return (
    <div
      className={`${
        centered ? "flex justify-center items-center min-h-[80vh]" : ""
      }`}
    >
      <div className={`w-full ${maxWidth} mx-auto px-4 sm:px-0 ${className}`}>
        <Card>
          {(title || subtitle) && (
            <div className="text-center mb-6">
              {title && (
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              )}
              {subtitle && (
                <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
              )}
            </div>
          )}

          {children}

          {footer && (
            <div className="mt-6 pt-4 border-t border-gray-200">{footer}</div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FormContainer;
