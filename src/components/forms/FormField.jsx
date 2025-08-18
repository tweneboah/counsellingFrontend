import React from "react";
import { Input, Select, TextArea } from "../ui";

/**
 * A component for form fields with validation and error handling
 * Wraps Input, Select, or TextArea components with consistent validation
 *
 * @param {Object} props
 * @param {'input'|'select'|'textarea'} props.type - Field type
 * @param {string} props.name - Field name
 * @param {Object} props.register - React Hook Form register function
 * @param {Object} props.errors - React Hook Form errors object
 * @param {Object} props.rest - All other props to pass to the underlying input component
 */
const FormField = ({ type = "input", name, register, errors, ...rest }) => {
  const errorMessage = errors && errors[name]?.message;
  const isInvalid = !!errorMessage;

  const commonProps = {
    id: name,
    name,
    error: isInvalid ? errorMessage : undefined,
    ...(register && {
      ...register(name),
    }),
    ...rest,
  };

  switch (type) {
    case "select":
      return <Select {...commonProps} />;
    case "textarea":
      return <TextArea {...commonProps} />;
    case "input":
    default:
      return <Input {...commonProps} />;
  }
};

export default FormField;
