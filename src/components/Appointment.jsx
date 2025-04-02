import React, { useState, useEffect } from "react";
import { FaCircleUser, FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { FaVolumeMute, FaCalendar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedTranscript, setSelectedTranscript] = useState(null);
  const [appointmentStatuses, setAppointmentStatuses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [audioAvailability, setAudioAvailability] = useState({});
  const rowsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const conversationsResponse = await fetch(
          "http://15.207.173.143/conversations"
        );
        if (!conversationsResponse.ok)
          throw new Error("Failed to fetch conversations");
        const conversationsData = await conversationsResponse.json();

        // Check audio availability for each conversation
        const audioStatus = {};
        for (const conv of conversationsData.conversations || []) {
          try {
            const audioResponse = await fetch(
              `http://15.207.173.143/audio/${conv.conversation_id}`
            );
            audioStatus[conv.conversation_id] = audioResponse.ok;
            // console.log(audioStatus);
          } catch (error) {
            audioStatus[conv.conversation_id] = false;
          }
        }
        setAudioAvailability(audioStatus);

        setConversations(conversationsData.conversations || []);
        setFilteredConversations(conversationsData.conversations || []);

        const appointmentsResponse = await fetch(
          "http://15.207.173.143/appointment"
        );
        if (!appointmentsResponse.ok)
          throw new Error("Failed to fetch appointments");
        const appointmentsData = await appointmentsResponse.json();

        const statusMap = {};
        appointmentsData.appointments.forEach((appointment) => {
          statusMap[appointment.conversation_id] =
            appointment.appointment_status;
        });
        setAppointmentStatuses(statusMap);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const calendar = document.getElementById("calendar-popup");
      if (
        calendar &&
        !calendar.contains(event.target) &&
        !event.target.closest(".calendar-trigger")
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = conversations.filter((conversation) => {
      const searchFields = [
        conversation.name,
        conversation.email,
        conversation.city,
        conversation.zip,
      ].map((field) => field?.toLowerCase() || "");

      return searchFields.some((field) =>
        field.includes(searchTerm.toLowerCase())
      );
    });
    setFilteredConversations(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, conversations]);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const updateCurrentDateDisplay = () => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const toggleTranscript = (index) => {
    setSelectedTranscript(selectedTranscript === index ? null : index);
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="text-center py-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`text-center py-2 hover:bg-gray-100 cursor-pointer rounded ${
            day === currentDate.getDate() &&
            month === currentDate.getMonth() &&
            year === currentDate.getFullYear()
              ? "bg-blue-100"
              : ""
          }`}
          onClick={() => {
            setCurrentDate(new Date(year, month, day));
            setShowCalendar(false);
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  // Pagination handlers
  const totalPages = Math.ceil(filteredConversations.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredConversations.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:block w-44 bg-[#3F51B5] text-white">
        <div className="py-4">
          <div className="my-4 cursor-pointer">
            <img
              src="/src/assets/images/OrthoBerry-removebg.png"
              alt="logo"
              className="w-full"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="py-4 border-t border-white/30">
            <div className="text-lg font-bold my-6 hidden lg:block bg-[#D0165D] py-4 px-4">
              Appointments
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-row justify-between items-center gap-4 mb-6">
          {/* Search Section */}
          <div className="relative flex items-center w-full sm:w-auto">
            <i className="fa-solid fa-search absolute left-3 text-gray-400"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, city or zip..."
              className="pl-3 pr-4 py-2 border border-gray-300 rounded-l-lg w-full focus:outline-none
               focus:border-[#3F51B5] text-sm sm:text-base"
            />
            <button className="bg-[#3F51B5] text-white px-4 py-[7px] rounded-r-lg hover:bg-[#32408f] text-sm sm:text-lg">
              Search
            </button>
          </div>

          {/* User Section */}
          <div className="flex items-center">
            <div className="bg-white rounded-full p-2">
              <FaCircleUser className="text-[#6774BD] text-xl sm:text-2xl" />
            </div>
            <span className="hidden sm:block text-[#5363BD] text-base sm:text-lg ml-2">
              Welcome
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm sm:text-lg">Appointment Demo</p>
        </div>
        <div className="my-4 pb-2">
          <p className="text-[#ABACBE] text-sm sm:text-lg">
            Showing:{" "}
            <span className="text-[#000000]">
              {filteredConversations.length} Appointments
            </span>
          </p>
          {filteredConversations.length === 0 && searchTerm && (
            <p className="text-gray-600 text-sm sm:text-lg mt-2">
              No appointments found matching "{searchTerm}". Please try a
              different search term.
            </p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="p-3 text-left text-xs sm:text-lg">Name</th>
                <th className="p-3 text-left text-xs sm:text-lg">Phone</th>
                <th className="p-3 text-left text-xs sm:text-lg">Mail</th>
                <th className="p-3 text-left text-xs sm:text-lg">Reason</th>
                <th className="p-3 text-left text-xs sm:text-lg">Gender</th>
                <th className="p-3 text-left text-xs sm:text-lg">Age</th>
                <th className="p-3 text-left text-xs sm:text-lg">City</th>
                <th className="p-3 text-left text-xs sm:text-lg">Zip</th>
                <th className="p-3 text-left text-xs sm:text-lg">History</th>
                <th className="p-3 text-left text-xs sm:text-lg">Date</th>
                <th className="p-3 text-left text-xs sm:text-lg">Time</th>
                <th className="p-3 text-left text-xs sm:text-lg">Referral</th>
                <th className="p-3 text-left text-xs sm:text-lg">Status</th>
                <th className="p-3 text-left text-xs sm:text-lg">Transcript</th>
                <th className="p-3 text-left text-xs sm:text-lg">Audio</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((conversation, index) => (
                <React.Fragment key={`conversation-${index}`}>
                  <tr className="hover:bg-[#EBF0FA] cursor-pointer">
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.name}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.phone}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.email}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.reason}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.gender}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.age}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.city}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.zip}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.history}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.app_date}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.app_time}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      {conversation.referral}
                    </td>
                    <td className="p-3 text-sm sm:text-base whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded ${
                          appointmentStatuses[conversation.conversation_id] ===
                          "Booked"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {appointmentStatuses[conversation.conversation_id] ||
                          "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-sm sm:text-base">
                      <button
                        onClick={() => toggleTranscript(index)}
                        className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 transition duration-200"
                      >
                        {selectedTranscript === index ? "Close" : "View"}
                      </button>
                    </td>
                    <td className="py-3 text-sm sm:text-base">
                      <div className="flex justify-start items-start gap-2">
                        <audio controls className="h-8 w-32">
                          <source
                            src={`http://15.207.173.143/audio/${conversation.conversation_id}`}
                            type="audio/mpeg"
                          />
                        </audio>
                      </div>
                    </td>
                  </tr>
                  {selectedTranscript === index && (
                    <tr key={`transcript-${index}`}>
                      <td colSpan="15" className="bg-gray-50 p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Conversation Details</h3>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow">
                            <h4 className="font-medium mb-2">Transcript:</h4>
                            <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-line">
                              {conversation.transcript}
                            </p>
                          </div>
                          <div className="bg-white p-4 rounded-lg shadow">
                            <h4 className="font-medium mb-2">Summary:</h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {conversation.summary}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}

        <div className="flex justify-end items-end gap-4 p-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaChevronLeft />
          </button>
          <span className="text-sm pb-1">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
