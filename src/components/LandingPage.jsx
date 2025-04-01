import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const navigate = useNavigate();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const handleCallClick = async () => {
    if (isMobile) {
      // For mobile devices, redirect to phone dialer
      window.location.href = "tel:6923888";
      return;
    }

    try {
      setIsCallInProgress(true);
      setCallStatus("Initiating call...");

      // Making an API call to trigger the inbound call via Twilio
      const response = await axios.post(
        "http://15.207.173.143/twilio/inbound_call"
      );

      if (response.status === 200) {
        // console.log("API Call successful", response.data);
        setCallStatus("Call connected successfully!");
        // console.log("Call connected successfully!");
        // Additional success handling
      } else {
        // console.error("Error: ", response.data);
        setCallStatus("Call failed to connect. Please try again.");
      }
    } catch (error) {
    //   console.error("Error making API call: ", error);
      setCallStatus("Call failed. Please check your connection and try again.");
    } finally {
      setIsCallInProgress(false);
    }
  };

  return (
    <div className="overflow-x-hidden font-customFont bg-white text-gray-900">
      {/* Fixed Width Wrapper */}
      <div className="max-w-screen-xl mx-auto transform transition-transform duration-300 ease-in-out xl:scale-100 2xl:scale-110">
        {/* Header Section */}
        <header className="sticky top-0 2xl:top-10 z-50 flex justify-between items-center p-3 sm:p-4 md:p-6 lg:p-8 bg-white">
          {/* Logo */}
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <img
              src="/src/assets/images/OrthoBerry-removebg.png"
              className="cursor-pointer w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] h-auto object-contain"
              alt="Berry Dial Logo"
            />
          </div>

          {/* Reach Us Button */}
          <div>
            <button
              className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-black text-white text-xs sm:text-sm md:text-base font-medium rounded-md shadow-lg hover:bg-zinc-200 hover:text-black hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-all duration-300 ease-in-out"
              onClick={() =>
                (window.location.href = "https://www.orthoberry.com/")
              }
            >
              Reach Us
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="relative flex flex-col justify-center items-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] p-4">
          {/* Eleven Labs Widget */}
          <div className="my-4 sm:my-6">
            <span
              style={{
                color: "#000000",
                fontFamily: "Arial Black",
                fontWeight: 900,
                fontSize: "clamp(24px, 5vw, 40px)",
                lineHeight: "100%",
                letterSpacing: "0%",
                verticalAlign: "middle",
              }}
            >
              (6*9) 23*-88*3
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              className={`flex items-center gap-2 py-3 px-6 rounded-md text-white text-base lg:text-xl transition-all duration-300 ease-in-out ${
                isCallInProgress
                  ? "bg-blue-600 cursor-wait"
                  : "bg-[#2D36D5] hover:bg-[#2D36D5]/80 hover:shadow-lg"
              }`}
              onClick={handleCallClick}
              disabled={isCallInProgress}
            >
              {isCallInProgress ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>Click to call</span>
                </>
              )}
            </button>
            {callStatus && (
              <div
                className={`text-sm ${
                  callStatus.includes("failed")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {callStatus}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-center my-6 sm:my-8 md:my-10 flex flex-col gap-2 sm:gap-4 md:gap-6">
            {/* Heading */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug px-2">
              Appointments <br /> Simplified With AI
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mx-2 sm:mx-4 leading-relaxed">
              Appointment | Conversation | All completely done with just a few
              clicks.
            </p>

            {/* Button */}
            <div className="mt-4 sm:mt-6">
              <button
                className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white text-xs sm:text-sm md:text-base font-medium rounded-md shadow-lg hover:bg-zinc-200 hover:text-black hover:border-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                onClick={() => navigate("/login")}
              >
                Appointment Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
