import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button, Card } from "../ui";

const StudentOnboarding = () => {
  const { currentUser, completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Consent and purpose
    consent: false,

    // Step 2: Reasons for seeking help
    reasonsForSeeking: {
      academic: false,
      personal: false,
      emotional: false,
      career: false,
      other: false,
    },
    otherReason: "",

    // Step 3: Mental health background
    previousCounseling: null,
    diagnosedConditions: [],
    medications: false,

    // Step 4: Current concerns
    stress: 1, // 1-5 scale
    anxiety: 1,
    mood: 1,
    sleep: 1,

    // Step 5: Preferences
    communicationStyle: "direct", // direct, supportive, analytical
    languagePreference: "English",
    topicsToAvoid: "",

    // Meta information
    completedAt: null,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name.startsWith("reasonsForSeeking.")) {
        const reason = name.split(".")[1];
        setFormData((prev) => ({
          ...prev,
          reasonsForSeeking: {
            ...prev.reasonsForSeeking,
            [reason]: checked,
          },
        }));
      } else if (name === "consent") {
        setFormData((prev) => ({ ...prev, consent: checked }));
      } else if (name === "previousCounseling" || name === "medications") {
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else if (name.startsWith("diagnosedConditions")) {
        const condition = value;
        setFormData((prev) => {
          const currentConditions = [...prev.diagnosedConditions];
          if (checked) {
            return {
              ...prev,
              diagnosedConditions: [...currentConditions, condition],
            };
          } else {
            return {
              ...prev,
              diagnosedConditions: currentConditions.filter(
                (c) => c !== condition
              ),
            };
          }
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add completion timestamp
    const completedData = {
      ...formData,
      completedAt: new Date().toISOString(),
    };

    // Use the completeOnboarding function from AuthContext
    completeOnboarding(completedData);

    // Add a small delay before navigation to ensure state is updated
    setTimeout(() => {
      // Redirect directly to chat
      navigate("/chat");
    }, 100);
  };

  // Validation for each step
  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.consent;
      case 2:
        return (
          Object.values(formData.reasonsForSeeking).some(Boolean) ||
          (formData.reasonsForSeeking.other && formData.otherReason.trim())
        );
      case 3:
        return true; // Optional step
      case 4:
        return true; // Sliders have default values
      case 5:
        return formData.communicationStyle && formData.languagePreference;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to CampusCare, {currentUser?.fullName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Please complete this quick onboarding process to help us provide you
            with better counseling support.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-cyan-600 h-2.5 rounded-full"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-gray-500 mt-1">
            Step {step} of 5
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Consent and Purpose */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Consent and Purpose
              </h2>
              <p className="text-gray-600">
                Before we begin, we want to make sure you understand how our AI
                counseling service works.
              </p>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">
                  Important Information:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  <li>
                    This service provides AI-powered counseling support but is
                    not a replacement for professional mental health care.
                  </li>
                  <li>
                    In case of emergency or crisis, please contact emergency
                    services or your university's counseling center directly.
                  </li>
                  <li>
                    Your information will be kept confidential, but counselors
                    may review conversations if you flag them for additional
                    help.
                  </li>
                  <li>
                    The AI counselor will use your information to provide more
                    personalized support and resources.
                  </li>
                </ul>
              </div>

              <div className="flex items-start mt-4">
                <input
                  type="checkbox"
                  id="consent"
                  name="consent"
                  className="mt-1 h-4 w-4"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="consent" className="ml-2 block text-gray-700">
                  I understand and agree to the terms of using the AI counseling
                  service. I acknowledge that this is not a replacement for
                  professional mental health treatment.
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Reasons for Seeking Help */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Why are you seeking counseling?
              </h2>
              <p className="text-gray-600 mb-4">
                Select all that apply. This helps us understand your needs
                better.
              </p>

              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="academic"
                    name="reasonsForSeeking.academic"
                    className="mt-1 h-4 w-4"
                    checked={formData.reasonsForSeeking.academic}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="academic"
                    className="ml-2 block text-gray-700"
                  >
                    <span className="font-medium">Academic Concerns</span>
                    <span className="block text-sm text-gray-500">
                      Stress about exams, coursework, grades, time management
                    </span>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="personal"
                    name="reasonsForSeeking.personal"
                    className="mt-1 h-4 w-4"
                    checked={formData.reasonsForSeeking.personal}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="personal"
                    className="ml-2 block text-gray-700"
                  >
                    <span className="font-medium">Personal Relationships</span>
                    <span className="block text-sm text-gray-500">
                      Roommate issues, family concerns, friendship or romantic
                      relationships
                    </span>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="emotional"
                    name="reasonsForSeeking.emotional"
                    className="mt-1 h-4 w-4"
                    checked={formData.reasonsForSeeking.emotional}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="emotional"
                    className="ml-2 block text-gray-700"
                  >
                    <span className="font-medium">Emotional Wellbeing</span>
                    <span className="block text-sm text-gray-500">
                      Anxiety, depression, mood swings, homesickness, loneliness
                    </span>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="career"
                    name="reasonsForSeeking.career"
                    className="mt-1 h-4 w-4"
                    checked={formData.reasonsForSeeking.career}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="career" className="ml-2 block text-gray-700">
                    <span className="font-medium">Career Guidance</span>
                    <span className="block text-sm text-gray-500">
                      Uncertainty about majors, career path, job searching
                    </span>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="other"
                    name="reasonsForSeeking.other"
                    className="mt-1 h-4 w-4"
                    checked={formData.reasonsForSeeking.other}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="other" className="ml-2 block text-gray-700">
                    <span className="font-medium">Other</span>
                  </label>
                </div>

                {formData.reasonsForSeeking.other && (
                  <div className="ml-6">
                    <input
                      type="text"
                      name="otherReason"
                      value={formData.otherReason}
                      onChange={handleInputChange}
                      placeholder="Please specify..."
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Mental Health Background (Optional) */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Mental Health Background{" "}
                <span className="text-sm font-normal text-gray-500">
                  (Optional)
                </span>
              </h2>
              <p className="text-gray-600 mb-4">
                This information helps us provide better support, but you can
                skip questions you prefer not to answer.
              </p>

              <div className="space-y-4">
                <div>
                  <p className="mb-3 text-gray-700 font-medium">
                    Have you received counseling or therapy in the past?
                  </p>
                  <div className="flex space-x-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="previousCounseling-yes"
                        name="previousCounseling"
                        value="true"
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                        checked={formData.previousCounseling === true}
                        onChange={() => setFormData(prev => ({ ...prev, previousCounseling: true }))}
                      />
                      <label
                        htmlFor="previousCounseling-yes"
                        className="ml-2 block text-gray-700"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="previousCounseling-no"
                        name="previousCounseling"
                        value="false"
                        className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300"
                        checked={formData.previousCounseling === false}
                        onChange={() => setFormData(prev => ({ ...prev, previousCounseling: false }))}
                      />
                      <label
                        htmlFor="previousCounseling-no"
                        className="ml-2 block text-gray-700"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-gray-700">
                    Have you been diagnosed with any of the following? (Select
                    all that apply)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      "Anxiety",
                      "Depression",
                      "ADHD",
                      "Bipolar Disorder",
                      "PTSD",
                      "Eating Disorder",
                      "OCD",
                      "Substance Use",
                    ].map((condition) => (
                      <div key={condition} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`condition-${condition}`}
                          name="diagnosedConditions"
                          value={condition}
                          className="h-4 w-4"
                          checked={formData.diagnosedConditions.includes(
                            condition
                          )}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor={`condition-${condition}`}
                          className="ml-2 text-gray-700"
                        >
                          {condition}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="medications"
                    name="medications"
                    className="mt-1 h-4 w-4"
                    checked={formData.medications}
                    onChange={handleInputChange}
                  />
                  <label
                    htmlFor="medications"
                    className="ml-2 block text-gray-700"
                  >
                    Are you currently taking any medications for mental health?
                  </label>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                Note: This information is kept confidential and is only used to
                personalize your counseling experience.
              </div>
            </div>
          )}

          {/* Step 4: Current Concerns */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Current Wellbeing
              </h2>
              <p className="text-gray-600 mb-4">
                Rate how you've been feeling over the past two weeks:
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Stress Level
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Low</span>
                    <input
                      type="range"
                      name="stress"
                      min="1"
                      max="5"
                      value={formData.stress}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Anxiety Level
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Low</span>
                    <input
                      type="range"
                      name="anxiety"
                      min="1"
                      max="5"
                      value={formData.anxiety}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Overall Mood
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Low</span>
                    <input
                      type="range"
                      name="mood"
                      min="1"
                      max="5"
                      value={formData.mood}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">High</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Sleep Quality
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Poor</span>
                    <input
                      type="range"
                      name="sleep"
                      min="1"
                      max="5"
                      value={formData.sleep}
                      onChange={handleSliderChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-gray-500">Good</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Preferences */}
          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Preferences
              </h2>
              <p className="text-gray-600 mb-4">
                Let us know how you'd prefer to interact with our AI counselor:
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Preferred Communication Style
                  </label>
                  <select
                    name="communicationStyle"
                    value={formData.communicationStyle}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="direct">Direct and Straightforward</option>
                    <option value="supportive">Warm and Supportive</option>
                    <option value="analytical">Analytical and Detailed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Preferred Language
                  </label>
                  <select
                    name="languagePreference"
                    value={formData.languagePreference}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="English">English</option>
                    <option value="Twi">Twi</option>
                    <option value="Ewe">Ewe</option>
                    <option value="Hausa">Hausa</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    Note: Some languages may have limited support.
                  </p>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Topics you'd prefer to avoid (Optional)
                  </label>
                  <textarea
                    name="topicsToAvoid"
                    value={formData.topicsToAvoid}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="2"
                    placeholder="Specific topics that might be triggering or uncomfortable"
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                Back
              </Button>
            ) : (
              <div></div> // Empty div for spacing
            )}

            {step < 5 ? (
              <Button
                variant="primary"
                onClick={nextStep}
                disabled={!canProceed()}
              >
                Continue
              </Button>
            ) : (
              <Button variant="primary" type="submit" disabled={!canProceed()}>
                Complete & Start
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default StudentOnboarding;
