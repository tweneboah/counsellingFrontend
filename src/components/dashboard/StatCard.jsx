import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui";

/**
 * A card component for displaying stats on the dashboard
 *
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string|number} props.value - Stat value to display
 * @param {string} props.label - Description of the stat
 * @param {string} props.linkTo - Optional URL to link to
 * @param {string} props.linkText - Text for the link
 * @param {string} props.iconBgColor - Background color class for the icon
 * @param {string} props.iconColor - Color class for the icon
 */
const StatCard = ({
  icon,
  value,
  label,
  linkTo,
  linkText,
  iconBgColor = "bg-cyan-100",
  iconColor = "text-cyan-600",
}) => {
  return (
    <Card className="flex flex-col items-center">
      <div className={`p-3 ${iconBgColor} rounded-full mb-4`}>
        {React.cloneElement(icon, {
          className: `h-8 w-8 ${iconColor} ${icon.props.className || ""}`,
        })}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm text-gray-500">{label}</p>

      {linkTo && (
        <Link
          to={linkTo}
          className="mt-4 text-sm text-cyan-600 hover:text-cyan-800"
        >
          {linkText || "View details"} →
        </Link>
      )}
    </Card>
  );
};

export default StatCard;
