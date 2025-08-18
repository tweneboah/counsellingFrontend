import React from "react";

/**
 * A reusable heading component with multiple levels
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content of the heading
 * @param {string} props.className - Additional classes
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'|'h6'} props.as - HTML element to render
 * @param {'xl'|'lg'|'md'|'sm'|'xs'} props.size - Visual size of heading (independent of semantic level)
 */
const Heading = ({
  children,
  className = "",
  as: Component = "h2",
  size = "lg",
}) => {
  // Size classes
  const sizeClasses = {
    xl: "text-4xl md:text-5xl font-bold",
    lg: "text-3xl font-bold",
    md: "text-2xl font-semibold",
    sm: "text-xl font-semibold",
    xs: "text-lg font-medium",
  };

  return (
    <Component className={`${sizeClasses[size]} ${className}`}>
      {children}
    </Component>
  );
};

export default Heading;
