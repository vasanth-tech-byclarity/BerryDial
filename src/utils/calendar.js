export const generateCalendarDays = (
  currentDate,
  setCurrentDate,
  setShowCalendar
) => {
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

export const updateCurrentDateDisplay = (currentDate) => {
  return currentDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const handleNextMonth = (setCurrentDate) => {
  setCurrentDate((prev) => {
    const newDate = new Date(prev);
    newDate.setMonth(prev.getMonth() + 1);
    return newDate;
  });
};

export const handlePrevMonth = (setCurrentDate) => {
  setCurrentDate((prev) => {
    const newDate = new Date(prev);
    newDate.setMonth(prev.getMonth() - 1);
    return newDate;
  });
};
