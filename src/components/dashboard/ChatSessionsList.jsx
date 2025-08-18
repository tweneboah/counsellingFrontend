import React from "react";
import { Link } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";
import { Card } from "../ui";

/**
 * A component for displaying recent chat sessions
 *
 * @param {Object} props
 * @param {Array} props.chats - Array of chat session objects
 * @param {string} props.title - Title for the section
 * @param {Function} props.formatDate - Function to format dates
 */
const ChatSessionsList = ({
  chats = [],
  title = "Recent Chat Sessions",
  formatDate,
}) => {
  if (chats.length === 0) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <Card className="text-center p-6">
          <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
            <FiMessageCircle className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-gray-600 mb-4">
            You haven't started any chat sessions yet.
          </p>
          <Link
            to="/chat"
            className="text-sm font-medium text-cyan-600 hover:text-cyan-800"
          >
            Start your first chat →
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <Card
        className="p-0 overflow-hidden"
        footer={
          <Link
            to="/chat"
            className="block text-sm font-medium text-cyan-600 hover:text-cyan-800"
          >
            View all chat sessions →
          </Link>
        }
      >
        <ul className="divide-y divide-gray-200">
          {chats.map((chat) => (
            <li key={chat.id} className="px-6 py-4 hover:bg-gray-50">
              <Link
                to={`/chat/${chat.id}`}
                className="flex justify-between items-center"
              >
                <div className="flex items-center">
                  <FiMessageCircle className="h-5 w-5 text-cyan-600 mr-3" />
                  <span className="text-gray-900 font-medium">
                    {chat.title}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    {typeof formatDate === "function"
                      ? formatDate(chat.updatedAt)
                      : new Date(chat.updatedAt).toLocaleString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default ChatSessionsList;
