import React from "react";
import { LoginForm } from "../../components/auth";

const Login = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex flex-col justify-center">
      <LoginForm />
    </div>
  );
};

export default Login;
