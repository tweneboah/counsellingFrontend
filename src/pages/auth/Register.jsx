import React from "react";
import { RegisterForm } from "../../components/auth";

const Register = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex flex-col justify-center">
      <RegisterForm />
    </div>
  );
};

export default Register;
