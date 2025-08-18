import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui";
import { FiAlertTriangle, FiArrowLeft } from "react-icons/fi";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white flex flex-col justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <FiAlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Denied</h1>

        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is an error.
        </p>

        <div className="flex flex-col space-y-3">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center justify-center"
          >
            <FiArrowLeft className="mr-2" />
            Go Back
          </Button>

          <Link to="/">
            <Button variant="primary" className="w-full">
              Go to Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
