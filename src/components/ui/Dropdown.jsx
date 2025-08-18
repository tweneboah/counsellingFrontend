import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

/**
 * Dropdown component for dropdown menus
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - Element that triggers the dropdown
 * @param {Array} props.items - Array of item objects with {id, label, onClick, disabled, icon}
 * @param {string} props.align - Dropdown alignment: 'left' (default), 'right'
 * @param {string} props.width - Dropdown width: 'auto' (default), 'sm', 'md', 'lg', 'full'
 * @param {boolean} props.closeOnClick - Whether to close dropdown when an item is clicked
 */
const Dropdown = ({
  trigger,
  items = [],
  align = "left",
  width = "auto",
  closeOnClick = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item) => {
    if (item.onClick) {
      item.onClick();
    }
    if (closeOnClick) {
      setIsOpen(false);
    }
  };

  // Width classes
  const widthClasses = {
    auto: "min-w-[12rem]",
    sm: "w-48",
    md: "w-64",
    lg: "w-80",
    full: "w-full",
  };

  // Alignment classes
  const alignClasses = {
    left: "left-0",
    right: "right-0",
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger || (
          <button
            type="button"
            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            Options
            <FiChevronDown className="ml-2 -mr-1 h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={`origin-top-right absolute z-10 mt-2 ${
            widthClasses[width] || widthClasses.auto
          } ${
            alignClasses[align] || alignClasses.left
          } rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100`}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {items.map((item, index) => (
              <React.Fragment key={item.id || index}>
                {item.divider ? (
                  <div className="my-1 border-t border-gray-100"></div>
                ) : (
                  <button
                    disabled={item.disabled}
                    onClick={() => handleItemClick(item)}
                    className={`${
                      item.disabled
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } group flex items-center w-full px-4 py-2 text-sm`}
                    role="menuitem"
                  >
                    {item.icon && (
                      <span className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500">
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
