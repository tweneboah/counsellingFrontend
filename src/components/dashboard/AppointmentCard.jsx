import React from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { Card, Badge } from "../ui";

/**
 * A component for displaying an upcoming appointment on the dashboard
 *
 * @param {Object} props
 * @param {Object} props.appointment - Appointment data
 * @param {string} props.appointment.id - Appointment ID
 * @param {string} props.appointment.title - Appointment title
 * @param {string} props.appointment.appointmentDate - Appointment date
 * @param {string} props.appointment.type - Appointment type (Zoom, In-person, etc.)
 * @param {Object} props.appointment.counselor - Counselor data
 * @param {string} props.appointment.counselor.fullName - Counselor's full name
 * @param {Function} props.formatDate - Function to format the date
 */
const AppointmentCard = ({ appointment, formatDate }) => {
  if (!appointment) {
    return (
      <Card className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-2 bg-orange-100 rounded-full mr-4">
            <FiClock className="h-6 w-6 text-orange-600" />
          </div>
          <p className="text-gray-600">
            You don't have any upcoming appointments.
          </p>
        </div>
        <Link
          to="/appointments"
          className="text-sm text-cyan-600 hover:text-cyan-800"
        >
          Schedule one →
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="p-2 bg-cyan-100 rounded-full mr-4">
            <FiClock className="h-6 w-6 text-cyan-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {appointment.title}
            </h3>
            <p className="text-sm text-gray-500">
              With {appointment.counselor?.fullName || "Counselor"}
            </p>
          </div>
        </div>
        <Badge variant={getAppointmentBadgeVariant(appointment.type)}>
          {appointment.type}
        </Badge>
      </div>
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between">
          <div className="text-sm text-gray-500">
            <span>Date and Time:</span>
            <p className="text-gray-900 font-medium">
              {typeof formatDate === "function"
                ? formatDate(appointment.appointmentDate)
                : new Date(appointment.appointmentDate).toLocaleString()}
            </p>
          </div>
          <Link
            to={`/appointments/${appointment.id}`}
            className="text-sm text-cyan-600 hover:text-cyan-800"
          >
            View details →
          </Link>
        </div>
      </div>
    </Card>
  );
};

/**
 * Helper function to determine badge variant based on appointment type
 */
function getAppointmentBadgeVariant(type) {
  switch (type) {
    case "Zoom":
    case "Virtual":
      return "primary";
    case "In-person":
    case "Physical":
      return "success";
    case "Phone":
      return "info";
    default:
      return "primary";
  }
}

export default AppointmentCard;
