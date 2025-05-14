const availableSlots = (date, time) => {
  let allSlots = [
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
    "05:30 PM",
    "06:00 PM",
    "06:30 PM",
    "07:00 PM",
    "07:30 PM",
    "08:00 PM",
    "08:30 PM",
    "09:00 PM",
    "09:30 PM",
  ];

  const fridayExtraSlots = [
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
  ];

  const friday = new Date(date).getDay() === 5;

      if (friday) {
      allSlots = [...fridayExtraSlots, ...allSlots]; 
    }

  return allSlots.includes(time.toUpperCase());
};

module.exports = availableSlots;
