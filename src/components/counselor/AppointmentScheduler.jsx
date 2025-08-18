import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiClock,
  FiUser,
  FiInfo,
} from "react-icons/fi";
import { Card, Button, Input, Select, TextArea, Modal, Alert } from "../ui";
import { FormContainer, FormGroup, FormActions, FormField } from "../forms";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CounselorService from "../../services/counselor.service";

// Form validation schema
const schema = yup.object({
  title: yup.string().required("Appointment title is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
  duration: yup
    .number()
    .required("Duration is required")
    .min(15, "Minimum duration is 15 minutes")
    .max(120, "Maximum duration is 120 minutes"),
  location: yup.string().required("Location is required"),
  notes: yup.string(),
  notifyStudent: yup.boolean(),
});

/**
 * AppointmentScheduler component for scheduling counseling appointments
 *
 * @param {Object} props
 * @param {string} props.studentId - ID of the student to schedule with (optional)
 * @param {function} props.onBack - Function to call when back button is clicked
 */
const AppointmentScheduler = ({ studentId: propStudentId, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [student, setStudent] = useState(null);
  const [studentOptions, setStudentOptions] = useState([]);
  const [loadingStudent, setLoadingStudent] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState(null);

  const { studentId: urlStudentId } = useParams();
  const navigate = useNavigate();

  // Use student ID from props or URL
  const studentId = propStudentId || urlStudentId;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "Counseling Session",
      date: "",
      time: "",
      duration: 30,
      location: "Counseling Office",
      notes: "",
      notifyStudent: true,
    },
  });

  // Load student data if studentId is provided
  useEffect(() => {
    if (studentId) {
      loadStudentData(studentId);
    } else {
      // Load list of students for the dropdown
      loadStudentOptions();
    }
  }, [studentId]);

  const loadStudentData = async (id) => {
    try {
      setLoadingStudent(true);
      const response = await CounselorService.getStudentById(id);

      if (response.data.success) {
        setStudent(response.data.student);
        // Pre-fill the appointment title
        setValue(
          "title",
          `Counseling Session with ${response.data.student.fullName}`
        );
      } else {
        setError("Failed to load student data");
      }
    } catch (error) {
      console.error("Error loading student data:", error);
      setError("An error occurred while loading student data");
    } finally {
      setLoadingStudent(false);
    }
  };

  const loadStudentOptions = async () => {
    try {
      setLoadingStudent(true);
      const response = await CounselorService.getStudents();

      if (response.data.success) {
        setStudentOptions(
          response.data.students.map((student) => ({
            value: student.id,
            label: `${student.fullName} (${student.studentId})`,
          }))
        );
      } else {
        setError("Failed to load student options");
      }
    } catch (error) {
      console.error("Error loading student options:", error);
      setError("An error occurred while loading student options");
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleStudentSelect = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      navigate(`/counselor/appointments/schedule/${selectedId}`);
    }
  };

  const onSubmit = (data) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const handleConfirmAppointment = async () => {
    if (!formData) return;

    try {
      setLoading(true);
      setError("");

      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);

      const appointmentData = {
        studentId: studentId,
        title: formData.title,
        dateTime: dateTime.toISOString(),
        duration: formData.duration,
        location: formData.location,
        notes: formData.notes,
        notifyStudent: formData.notifyStudent,
      };

      const response = await CounselorService.createAppointment(
        appointmentData
      );

      if (response.data.success) {
        setSuccess(true);
        setShowConfirmation(false);

        // Redirect after a short delay
        setTimeout(() => {
          if (studentId) {
            navigate(`/counselor/students/${studentId}`);
          } else {
            navigate("/counselor/appointments");
          }
        }, 2000);
      } else {
        setError(response.data.message || "Failed to schedule appointment");
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      setError("An error occurred while scheduling the appointment");
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Button
          variant="ghost"
          onClick={onBack || (() => navigate(-1))}
          className="mr-2"
          aria-label="Back"
        >
          <FiArrowLeft />
        </Button>
        <h2 className="text-lg font-semibold text-gray-900">
          Schedule Appointment
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Success message */}
        {success && (
          <Alert type="success" title="Appointment Scheduled" className="mb-6">
            The appointment has been successfully scheduled.
          </Alert>
        )}

        {/* Error message */}
        {error && (
          <Alert type="error" title="Error" className="mb-6">
            {error}
          </Alert>
        )}

        <FormContainer
          title={
            student
              ? `Schedule an Appointment with ${student.fullName}`
              : "Schedule an Appointment"
          }
          centered={false}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              {/* Student selection (only if no student is pre-selected) */}
              {!studentId && (
                <FormField
                  type="select"
                  name="studentId"
                  label="Select Student"
                  required
                  onChange={handleStudentSelect}
                  disabled={loadingStudent}
                  options={[
                    { value: "", label: "-- Select a student --" },
                    ...studentOptions,
                  ]}
                  register={register}
                  errors={errors}
                />
              )}

              {/* Appointment details */}
              <FormField
                name="title"
                label="Appointment Title"
                placeholder="e.g., Initial Counseling Session"
                required
                register={register}
                errors={errors}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  name="date"
                  label="Date"
                  type="date"
                  required
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="time"
                  label="Time"
                  type="time"
                  required
                  register={register}
                  errors={errors}
                />

                <FormField
                  name="duration"
                  label="Duration (minutes)"
                  type="number"
                  min={15}
                  max={120}
                  step={15}
                  required
                  register={register}
                  errors={errors}
                />
              </div>

              <FormField
                name="location"
                label="Location"
                placeholder="e.g., Counseling Center, Room 101, or Zoom"
                required
                register={register}
                errors={errors}
              />

              <FormField
                type="textarea"
                name="notes"
                label="Notes or Agenda"
                placeholder="Optional notes about the appointment"
                rows={4}
                register={register}
                errors={errors}
              />

              <div className="flex items-center mt-2">
                <input
                  id="notifyStudent"
                  type="checkbox"
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                  {...register("notifyStudent")}
                />
                <label
                  htmlFor="notifyStudent"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Send email notification to student
                </label>
              </div>

              <FormActions align="right">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack || (() => navigate(-1))}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  disabled={loading || !studentId}
                >
                  Schedule Appointment
                </Button>
              </FormActions>
            </FormGroup>
          </form>
        </FormContainer>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Appointment"
        size="md"
        footer={
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmAppointment}
              isLoading={loading}
              disabled={loading}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Alert type="info" className="mb-4">
            Please confirm the appointment details before scheduling.
          </Alert>

          {formData && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Student</h4>
                <p className="text-gray-900">
                  {student ? student.fullName : "Selected Student"}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Title</h4>
                <p className="text-gray-900">{formData.title}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date</h4>
                  <p className="text-gray-900">{formData.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Time</h4>
                  <p className="text-gray-900">{formData.time}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Duration
                  </h4>
                  <p className="text-gray-900">{formData.duration} minutes</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500">Location</h4>
                <p className="text-gray-900">{formData.location}</p>
              </div>

              {formData.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                  <p className="text-gray-900">{formData.notes}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500">
                  Notification
                </h4>
                <p className="text-gray-900">
                  {formData.notifyStudent
                    ? "Email notification will be sent to student"
                    : "No email notification will be sent"}
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Card>
  );
};

export default AppointmentScheduler;
