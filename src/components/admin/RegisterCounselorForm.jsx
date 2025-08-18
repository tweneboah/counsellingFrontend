import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Alert } from "../ui";
import { FormContainer, FormGroup, FormActions, FormField } from "../forms";
import AdminService from "../../services/admin.service";

// Form validation schema
const schema = yup.object({
  fullName: yup.string().required("Full name is required"),
  staffId: yup.string().required("Staff ID is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  gender: yup.string().required("Gender is required"),
  department: yup.string().required("Department is required"),
  role: yup.string().required("Role is required"),
});

const RegisterCounselorForm = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: "counselor",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError("");

      // Remove confirmPassword before sending to API
      const { confirmPassword, ...counselorData } = data;

      // Set default permissions based on role
      counselorData.permissions = {
        viewStudents: true,
        editProfiles: data.role === "admin",
        scheduleAppointments: true,
        viewReports: data.role === "admin" || data.role === "moderator",
        manageUsers: data.role === "admin",
      };

      console.log("Registering counselor:", counselorData);
      const response = await AdminService.registerCounselor(counselorData);

      if (response.data && response.data.status === "success") {
        setSuccess(true);
        reset(); // Clear form

        // Call the onSuccess callback if provided
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.data.data);
        }
      } else {
        setError(response.data?.message || "Failed to register counselor");
      }
    } catch (error) {
      console.error("Error registering counselor:", error);
      if (error.response) {
        setError(
          error.response.data?.message || "Failed to register counselor"
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer
      title="Register New Counselor"
      subtitle="Create an account for a new counselor or admin"
      maxWidth="max-w-2xl"
    >
      {error && (
        <Alert type="error" title="Error" className="mb-6">
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" title="Success" className="mb-6">
          Counselor registered successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="fullName"
              label="Full Name"
              placeholder="Enter full name"
              required
              register={register}
              errors={errors}
            />

            <FormField
              name="staffId"
              label="Staff ID"
              placeholder="Enter staff ID"
              required
              register={register}
              errors={errors}
            />

            <FormField
              name="email"
              label="Email Address"
              placeholder="Enter email address"
              required
              register={register}
              errors={errors}
            />

            <FormField
              name="phoneNumber"
              label="Phone Number"
              placeholder="Enter phone number"
              required
              register={register}
              errors={errors}
            />

            <FormField
              type="select"
              name="gender"
              label="Gender"
              required
              register={register}
              errors={errors}
              options={[
                { value: "", label: "-- Select gender --" },
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
                { value: "Other", label: "Other" },
              ]}
            />

            <FormField
              name="department"
              label="Department"
              placeholder="E.g., Mental Health, Career Guidance"
              required
              register={register}
              errors={errors}
            />

            <FormField
              type="password"
              name="password"
              label="Password"
              placeholder="Enter password"
              required
              register={register}
              errors={errors}
            />

            <FormField
              type="password"
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm password"
              required
              register={register}
              errors={errors}
            />

            <FormField
              type="select"
              name="role"
              label="Role"
              required
              register={register}
              errors={errors}
              options={[
                { value: "counselor", label: "Counselor" },
                { value: "moderator", label: "Moderator" },
                { value: "admin", label: "Admin" },
              ]}
            />
          </div>

          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              disabled={loading}
            >
              Register Counselor
            </Button>
          </FormActions>
        </FormGroup>
      </form>
    </FormContainer>
  );
};

export default RegisterCounselorForm;
