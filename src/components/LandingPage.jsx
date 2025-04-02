import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = () => {
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [callStatus, setCallStatus] = useState("");
  const navigate = useNavigate();

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const phoneNumber = "+19205480657";
  const formattedPhoneNumber = "+1(920)548-0657";

  const handleCallClick = async () => {
    if (isMobile) {
      console.log("Redirecting to dialer...");
      window.location.href = `tel:${phoneNumber}`;
      return;
    }
    try {
      setIsCallInProgress(true);

      console.log("Making API call...");
      const response = await axios.post(
        "http://15.207.173.143/twilio/inbound_call"
      );

      console.log("API Response:", response);

      if (response.status === 200) {
        // setCallStatus("Call connected successfully!");
        openAppSelector();
      } else {
        setCallStatus("Call failed. Please try again.");
      }
    } catch (error) {
      console.error("Error making API call:", error);
      setCallStatus("Call failed. Check your connection and try again.");
    } finally {
      setIsCallInProgress(false);
    }
  };

  const openAppSelector = () => {
    const appChoice = window.confirm(
      "Choose your calling app:\n1. Microsoft Teams\n2. Zoom\n3. Skype\n\nClick OK to open Microsoft Teams, Cancel for Zoom, or type Skype for Skype."
    );

    if (appChoice) {
      window.location.href = `msteams:/l/call/0/${phoneNumber}`;
    } else {
      const skypeChoice = window.prompt(
        "Enter 'Skype' to open Skype directly:"
      );
      if (skypeChoice === "Skype") {
        window.location.href = `skype:${phoneNumber}?call`;
      } else {
        window.location.href = "https://zoom.us";
      }
    }
  };

  useEffect(() => {
    console.log("Call Status Updated:", callStatus);
  }, [callStatus]);

  return (
    <div className="overflow-x-hidden font-customFont bg-white text-gray-900">
      <div className="max-w-screen-xl mx-auto transform transition-transform duration-300 ease-in-out xl:scale-100 2xl:scale-110">
        <header className="sticky top-0 2xl:top-10 z-50 flex justify-between items-center p-3 sm:p-4 md:p-6 lg:p-8 bg-white">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <img
              src="/src/assets/images/OrthoBerry-removebg.png"
              className="cursor-pointer w-[100px] sm:w-[150px] md:w-[200px] lg:w-[250px] h-auto object-contain"
              alt="Berry Dial Logo"
            />
          </div>
          <button
            className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white text-xs sm:text-sm md:text-base font-medium rounded-md shadow-lg hover:bg-gray-800 transition-all duration-300 ease-in-out"
            onClick={() =>
              (window.location.href = "https://www.orthoberry.com/")
            }
          >
            Reach Us
          </button>
        </header>

        <div className="relative flex flex-col justify-center items-center min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] p-4">
          <div className="my-4 sm:my-6">
            <span className=" text-[#111827] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              {formattedPhoneNumber}
            </span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <button
              className={`relative flex items-center gap-2 py-3 px-6 rounded-md text-white text-base lg:text-xl transition-all duration-300 ease-in-out overflow-hidden
                ${
                  isCallInProgress
                    ? "bg-blue-600 cursor-wait"
                    : "bg-[#2D36D5] hover:bg-[#1E2BB8] active:scale-95 shadow-lg"
                }`}
              onClick={handleCallClick}
              disabled={isCallInProgress}
            >
              {isCallInProgress ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="opacity-80">Calling...</span>
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
                  <span>Click to Call</span>
                </>
              )}
              {/* Ripple effect */}
              <span className="absolute inset-0 bg-white opacity-10 scale-0 transition-transform duration-500 ease-out group-active:scale-150"></span>
            </button>

            {callStatus && (
              <div
                className={`text-sm transition-opacity duration-300 ease-in-out ${
                  callStatus.includes("failed")
                    ? "text-red-500"
                    : "text-green-500"
                }`}
              >
                {callStatus}
              </div>
            )}
          </div>

          <div className="text-center my-6 sm:my-8 md:my-10 flex flex-col gap-2 sm:gap-4 md:gap-6">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug px-2">
              Appointments <br />
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-snug px-2">
              Simplified With AI
            </span>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mx-2 sm:mx-4 leading-relaxed">
              Appointment | Conversation | All completely done with just a few
              clicks.
            </p>
            <div className="mt-4 sm:mt-6">
              <button
                className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white text-xs sm:text-sm md:text-base font-medium rounded-md shadow-lg hover:bg-gray-800 transition-all duration-300 ease-in-out"
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
