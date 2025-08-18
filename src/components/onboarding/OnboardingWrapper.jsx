import React, { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { StudentOnboarding } from ".";

const OnboardingWrapper = ({ children }) => {
  const { needsOnboarding, onboardingCompleted } = useAuth();

  // Effect to scroll to top when onboarding starts
  useEffect(() => {
    if (needsOnboarding) {
      window.scrollTo(0, 0);
    }
  }, [needsOnboarding]);

  // Show onboarding process if needed
  if (needsOnboarding && !onboardingCompleted) {
    return <StudentOnboarding />;
  }

  // Otherwise, render the original content
  return <>{children}</>;
};

export default OnboardingWrapper;
