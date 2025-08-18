import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageCircle,
  FiCalendar,
  FiShield,
  FiClock,
  FiHeart,
  FiStar,
  FiZap,
  FiTarget,
  FiCheck,
  FiArrowRight,
  FiUsers,
  FiSmile,
  FiLock,
} from "react-icons/fi";
import { Button, Card, Heading } from "../components/ui";

const Landing = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-[#003049] via-[#d62828] to-[#f77f00] min-h-screen flex items-center">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-32 h-32 bg-[#fcbf49] rounded-full opacity-10"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full opacity-10"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-32 left-1/3 w-16 h-16 bg-[#fcbf49] rounded-full opacity-20"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-20 h-20 bg-white rounded-full opacity-15"
            animate={{
              rotate: [0, -180, -360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="lg:flex lg:items-center lg:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="lg:w-1/2 mb-12 lg:mb-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
              >
                <FiHeart className="w-5 h-5 text-[#fcbf49] mr-2" />
                <span className="text-white font-semibold">
                  Trusted by 10,000+ students
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
              >
                Your{" "}
                <span className="bg-gradient-to-r from-[#fcbf49] to-[#f77f00] bg-clip-text text-transparent">
                  AI-Powered
                </span>
                <br />
                Counselor
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed max-w-2xl"
              >
                Get 24/7 emotional support, guidance, and a safe space to
                express yourself. Our AI counselor is here to help you navigate
                university life with confidence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    as={Link}
                    to="/register"
                    className="bg-gradient-to-r from-[#fcbf49] to-[#f77f00] hover:from-[#f77f00] hover:to-[#fcbf49] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 flex items-center justify-center"
                  >
                    <FiZap className="mr-2 w-5 h-5" />
                    Get Started Free
                    <FiArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    as={Link}
                    to="/login"
                    className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#003049] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <FiUsers className="mr-2 w-5 h-5" />
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-12 grid grid-cols-3 gap-8"
              >
                {[
                  { number: "10K+", label: "Students Helped" },
                  { number: "24/7", label: "Available Support" },
                  { number: "100%", label: "Confidential" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-[#fcbf49] mb-1">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="lg:w-1/2 lg:flex lg:justify-end"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -left-8 w-16 h-16 bg-[#fcbf49] rounded-full opacity-20"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-4 -right-4 w-12 h-12 bg-white rounded-full opacity-30"
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20"
                >
                  <div className="w-full h-80 bg-gradient-to-br from-white/20 to-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder for illustration or hero image */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#fcbf49]/20 to-[#f77f00]/20"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-[#fcbf49] to-[#f77f00] rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiMessageCircle className="w-12 h-12 text-white" />
                      </div>
                      <div className="text-white text-lg font-semibold mb-2">
                        AI Counselor Chat
                      </div>
                      <div className="text-white/80 text-sm">
                        Available 24/7 for support
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-16 fill-white"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,60 C400,0 800,120 1200,60 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-gradient-to-r from-[#f77f00]/10 to-[#fcbf49]/10 rounded-full px-6 py-3 mb-8"
          >
            <FiStar className="w-5 h-5 text-[#f77f00] mr-2" />
            <span className="text-[#003049] font-semibold">
              Comprehensive Support
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#003049] mb-6"
          >
            How We Support You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Our platform offers a comprehensive suite of tools designed to
            support your mental health and academic success throughout your
            university journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<FiMessageCircle />}
            title="AI Counseling"
            description="Chat with our AI counselor anytime for immediate support and guidance. Available 24/7 for your convenience."
            gradient="from-[#003049] to-[#d62828]"
            delay={0.1}
          />

          <FeatureCard
            icon={<FiCalendar />}
            title="Human Appointments"
            description="Schedule appointments with human counselors for in-depth support or follow-ups when needed."
            gradient="from-[#d62828] to-[#f77f00]"
            delay={0.2}
          />

          <FeatureCard
            icon={<FiShield />}
            title="Private Journaling"
            description="Document your thoughts and feelings privately, with optional AI insights to help process emotions."
            gradient="from-[#f77f00] to-[#fcbf49]"
            delay={0.3}
          />


        </div>
      </motion.div>

      {/* Why It Matters Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white py-24 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-[#fcbf49]/5 to-[#f77f00]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-br from-[#d62828]/5 to-[#003049]/5 rounded-full blur-2xl"></div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="text-center mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center bg-gradient-to-r from-[#003049]/10 to-[#d62828]/10 rounded-full px-6 py-3 mb-8"
            >
              <FiTarget className="w-5 h-5 text-[#d62828] mr-2" />
              <span className="text-[#003049] font-semibold">
                Making a Difference
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-[#003049] mb-6"
            >
              Why It Matters
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              Our platform addresses key challenges faced by students on
              Ghanaian university campuses, providing solutions that truly make
              a difference.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <BenefitCard
              title="Limited Access to Counselors"
              description="With few trained counselors serving thousands of students, our AI provides immediate support before escalating to human counselors when needed."
              icon={<FiUsers />}
              delay={0.1}
            />

            <BenefitCard
              title="Stigma Around Counseling"
              description="Our platform offers privacy and anonymity, reducing barriers to seeking help and ensuring students feel comfortable."
              icon={<FiLock />}
              delay={0.2}
            />

            <BenefitCard
              title="Mental Health Crises Often Go Unnoticed"
              description="The app can flag students at risk through mood analysis and usage patterns, providing early intervention opportunities."
              icon={<FiHeart />}
              delay={0.3}
            />


          </div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#003049] via-[#d62828] to-[#f77f00] py-24 relative overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-16 left-16 w-24 h-24 bg-white rounded-full opacity-10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-32 h-32 bg-[#fcbf49] rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8"
          >
            <FiSmile className="w-5 h-5 text-[#fcbf49] mr-2" />
            <span className="text-white font-semibold">Join Our Community</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-8"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join thousands of students already benefiting from our counseling
            platform. Your mental wellbeing matters, and we're here to support
            you every step of the way.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                as={Link}
                to="/register"
                className="bg-gradient-to-r from-[#fcbf49] to-[#f77f00] hover:from-[#f77f00] hover:to-[#fcbf49] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 border-0 flex items-center justify-center"
              >
                <FiZap className="mr-2 w-5 h-5" />
                Register Now
                <FiArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                as={Link}
                to="/login"
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#003049] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center"
              >
                <FiUsers className="mr-2 w-5 h-5" />
                Sign In
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced Feature Card component with animations
const FeatureCard = ({ icon, title, description, gradient, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#f77f00] relative overflow-hidden group"
    >
      {/* Decorative background elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-[#fcbf49] rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#f77f00] rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>

      <motion.div
        whileHover={{ scale: 1.1, rotate: 10 }}
        className={`inline-flex items-center justify-center p-4 bg-gradient-to-r ${gradient} rounded-2xl text-white mb-6 shadow-lg`}
      >
        {React.cloneElement(icon, {
          className: `h-8 w-8 ${icon.props.className || ""}`,
        })}
      </motion.div>

      <motion.h3
        className="text-xl font-bold text-[#003049] mb-4 group-hover:text-[#d62828] transition-colors"
        whileHover={{ x: 5 }}
      >
        {title}
      </motion.h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

// Enhanced Benefit Card component with animations
const BenefitCard = ({ title, description, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#f77f00] relative overflow-hidden group"
    >
      {/* Decorative background elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-[#fcbf49] rounded-full opacity-20 group-hover:opacity-40 transition-opacity"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#f77f00] rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>

      <motion.div
        whileHover={{ scale: 1.1 }}
        className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-[#f77f00] to-[#fcbf49] rounded-xl text-white mb-6"
      >
        {React.cloneElement(icon, {
          className: "h-6 w-6",
        })}
      </motion.div>

      <motion.h3
        className="text-xl font-bold text-[#003049] mb-4 group-hover:text-[#d62828] transition-colors"
        whileHover={{ x: 5 }}
      >
        {title}
      </motion.h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default Landing;
