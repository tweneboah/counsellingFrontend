import React from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui";

/**
 * A component for displaying resources on the dashboard
 *
 * @param {Object} props
 * @param {string} props.title - Title of the resource section
 * @param {Array} props.items - Array of resource items
 * @param {string} props.linkTo - URL to view all resources
 * @param {string} props.linkText - Text for the link
 */
const ResourceCard = ({
  title = "Mental Health Tips",
  items = [],
  linkTo = "/resources",
  linkText = "View all resources",
}) => {
  return (
    <Card
      className="h-full"
      footer={
        <Link
          to={linkTo}
          className="text-sm font-medium text-cyan-600 hover:text-cyan-800"
        >
          {linkText} →
        </Link>
      }
    >
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-3 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 h-5 w-5 text-cyan-600">•</span>
              <span className="ml-2 text-gray-600">{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center text-gray-500 py-4">
          No resources available
        </div>
      )}
    </Card>
  );
};

export default ResourceCard;
