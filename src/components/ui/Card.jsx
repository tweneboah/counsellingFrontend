import React from "react";

/**
 * A reusable card component with optional header and footer
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content of the card
 * @param {string} props.className - Additional classes to add to the card
 * @param {React.ReactNode} props.header - Optional header content
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {boolean} props.hoverable - Whether the card should have hover effects
 */
const Card = ({
  children,
  className = "",
  header,
  footer,
  hoverable = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow ${
        hoverable ? "hover:shadow-md transition-shadow" : ""
      } ${className}`}
    >
      {header && (
        <div className="px-6 py-4 border-b border-gray-200">{header}</div>
      )}
      <div className="p-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
