import React from "react";

/**
 * Skeleton component for loading states
 *
 * @param {Object} props
 * @param {string} props.type - Skeleton type: 'text', 'circle', 'rectangle', 'card', 'avatar'
 * @param {number} props.width - Width (in pixels or with unit)
 * @param {number} props.height - Height (in pixels or with unit)
 * @param {number} props.count - Number of skeleton elements to display
 * @param {string} props.className - Additional classes
 * @param {boolean} props.animated - Whether the skeleton should pulse
 */
const Skeleton = ({
  type = "text",
  width,
  height,
  count = 1,
  className = "",
  animated = true,
}) => {
  // Base classes for all skeleton types
  const baseClasses = `bg-gray-200 rounded ${
    animated ? "animate-pulse" : ""
  } ${className}`;

  // Type-specific styling
  const typeClasses = {
    text: "h-4 rounded w-full",
    circle: "rounded-full",
    rectangle: "rounded",
    card: "rounded-md",
    avatar: "rounded-full",
  };

  // Determine dimensions
  const getStyle = () => {
    const style = {};

    if (width) {
      style.width = typeof width === "number" ? `${width}px` : width;
    }

    if (height) {
      style.height = typeof height === "number" ? `${height}px` : height;
    } else {
      // Default heights for different types if not specified
      switch (type) {
        case "circle":
        case "avatar":
          style.height = style.width || "40px";
          break;
        case "card":
          style.height = "100px";
          break;
      }
    }

    return style;
  };

  // Render skeleton elements
  const renderSkeleton = () => {
    return (
      <div
        className={`${baseClasses} ${
          typeClasses[type] || typeClasses.rectangle
        }`}
        style={getStyle()}
      />
    );
  };

  // Render multiple skeletons if count > 1
  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <div key={index}>{renderSkeleton()}</div>
          ))}
      </div>
    );
  }

  return renderSkeleton();
};

export default Skeleton;
