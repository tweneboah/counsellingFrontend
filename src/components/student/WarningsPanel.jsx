import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiAlertTriangle,
  FiX,
  FiCheck,
  FiClock,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import StudentService from "../../services/student.service";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Modal from "../ui/Modal";

const WarningsPanel = ({ className = "" }) => {
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWarning, setSelectedWarning] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchWarnings();
  }, []);

  const fetchWarnings = async () => {
    try {
      setLoading(true);
      const response = await StudentService.getMyWarnings(1, 20);
      setWarnings(response.data.warnings || []);
    } catch (err) {
      setError("Failed to load warnings");
      console.error("Error fetching warnings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledgeWarning = async (warningId) => {
    try {
      await StudentService.acknowledgeWarning(warningId);
      setWarnings(prev =>
        prev.map(warning =>
          warning._id === warningId
            ? { ...warning, acknowledged: true, acknowledgedAt: new Date() }
            : warning
        )
      );
      setShowWarningModal(false);
      setSelectedWarning(null);
    } catch (err) {
      setError("Failed to acknowledge warning");
      console.error("Error acknowledging warning:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "content_flagged":
        return "⚠️";
      case "behavioral":
        return "👤";
      case "academic":
        return "📚";
      default:
        return "ℹ️";
    }
  };

  const unacknowledgedWarnings = warnings.filter(w => !w.acknowledged);
  const displayedWarnings = showAll ? warnings : warnings.slice(0, 3);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (warnings.length === 0) {
    return (
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiCheck className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">All Clear!</h3>
        </div>
        <p className="text-gray-600">
          You have no warnings at this time. Keep up the good work!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Warnings</h3>
              {unacknowledgedWarnings.length > 0 && (
                <p className="text-sm text-orange-600">
                  {unacknowledgedWarnings.length} unacknowledged warning{unacknowledgedWarnings.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          {warnings.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="flex items-center space-x-1"
            >
              {showAll ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
              <span>{showAll ? "Show Less" : "Show All"}</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {displayedWarnings.map((warning) => (
              <motion.div
                key={warning._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-all ${
                  warning.acknowledged
                    ? "bg-gray-50 border-gray-200"
                    : getSeverityColor(warning.severity)
                }`}
                onClick={() => {
                  setSelectedWarning(warning);
                  setShowWarningModal(true);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <span className="text-lg">{getTypeIcon(warning.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge
                          variant="secondary"
                          className={`text-xs ${getSeverityColor(warning.severity)}`}
                        >
                          {warning.severity || "Medium"}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(warning.issuedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {warning.message}
                      </p>
                      {warning.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {warning.reason}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    {warning.acknowledged ? (
                      <div className="flex items-center text-green-600">
                        <FiCheck className="w-4 h-4" />
                        <span className="text-xs ml-1">Acknowledged</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-orange-600">
                        <FiClock className="w-4 h-4" />
                        <span className="text-xs ml-1">Pending</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
      </div>

      {/* Warning Detail Modal */}
      <Modal
        isOpen={showWarningModal}
        onClose={() => {
          setShowWarningModal(false);
          setSelectedWarning(null);
        }}
        title="Warning Details"
        size="md"
      >
        {selectedWarning && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{getTypeIcon(selectedWarning.type)}</span>
                <div>
                  <Badge
                    variant="secondary"
                    className={getSeverityColor(selectedWarning.severity)}
                  >
                    {selectedWarning.severity || "Medium"} Severity
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    Issued on {formatDate(selectedWarning.issuedAt)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Message</h4>
              <div className="bg-white border rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedWarning.message}
                </p>
              </div>
            </div>

            {selectedWarning.reason && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Reason</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedWarning.reason}
                </p>
              </div>
            )}

            {selectedWarning.issuedBy && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Issued By</h4>
                <p className="text-gray-600">
                  {selectedWarning.issuedBy.fullName || "System"}
                </p>
              </div>
            )}

            {selectedWarning.acknowledged && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center text-green-700">
                  <FiCheck className="w-4 h-4 mr-2" />
                  <span className="font-medium">Acknowledged</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  You acknowledged this warning on {formatDate(selectedWarning.acknowledgedAt)}
                </p>
              </div>
            )}

            <div className="flex space-x-3 justify-end pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => {
                  setShowWarningModal(false);
                  setSelectedWarning(null);
                }}
              >
                Close
              </Button>
              {!selectedWarning.acknowledged && (
                <Button
                  variant="primary"
                  onClick={() => handleAcknowledgeWarning(selectedWarning._id)}
                  className="flex items-center space-x-2"
                >
                  <FiCheck className="w-4 h-4" />
                  <span>Acknowledge Warning</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default WarningsPanel; 