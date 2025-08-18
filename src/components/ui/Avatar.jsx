import React from "react";

/**
 * Avatar component for displaying user profile images
 *
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alternative text for the image
 * @param {string} props.initials - Initials to display when no image is available
 * @param {string} props.size - Avatar size: 'xs', 'sm', 'md' (default), 'lg', 'xl'
 * @param {string} props.status - User status: 'online', 'offline', 'busy', 'away'
 * @param {string} props.className - Additional classes
 * @param {boolean} props.rounded - Whether to use rounded corners instead of full circle
 */
const Avatar = ({
  src,
  alt,
  initials,
  size = "md",
  status,
  className = "",
  rounded = false,
}) => {
  // Size classes
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
  };

  // Status indicator classes
  const statusClasses = {
    online: "bg-green-400",
    offline: "bg-gray-400",
    busy: "bg-red-400",
    away: "bg-yellow-400",
  };

  // Size of status indicator based on avatar size
  const statusSizeClasses = {
    xs: "h-1.5 w-1.5",
    sm: "h-2 w-2",
    md: "h-2.5 w-2.5",
    lg: "h-3 w-3",
    xl: "h-4 w-4",
  };

  // Get initials from alt text if not provided
  const getInitials = () => {
    if (initials) return initials;
    if (!alt) return "";

    return alt
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Background color for initials avatar (based on initials to keep it consistent)
  const getInitialsBackgroundColor = () => {
    const colors = [
      "bg-red-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-purple-500",
      "bg-pink-500",
    ];

    const initials = getInitials();
    if (!initials) return colors[0];

    // Use the sum of character codes to determine the color
    const charSum = initials
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    return colors[charSum % colors.length];
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt || "Avatar"}
          className={`object-cover ${rounded ? "rounded-md" : "rounded-full"} ${
            sizeClasses[size] || sizeClasses.md
          } ${className}`}
        />
      ) : (
        <div
          className={`flex items-center justify-center ${
            rounded ? "rounded-md" : "rounded-full"
          } ${
            sizeClasses[size] || sizeClasses.md
          } ${getInitialsBackgroundColor()} text-white font-medium ${className}`}
        >
          {getInitials()}
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${
            statusClasses[status] || statusClasses.offline
          } ${statusSizeClasses[size] || statusSizeClasses.md}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
