import React from "react";

/**
 * Tabs component for tabbed interfaces
 *
 * @param {Object} props
 * @param {Array} props.tabs - Array of tab objects with {id, label}
 * @param {string} props.activeTab - ID of the active tab
 * @param {function} props.onChange - Callback when tab changes
 */
const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex -mb-px space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === tab.id
                ? "border-cyan-500 text-cyan-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
