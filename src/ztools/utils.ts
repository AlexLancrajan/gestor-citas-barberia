import { ScheduleFields } from "../date/domain/date";

export const generateDates = (initDate: Date, endDate: Date, minutes: number) => {
  const dateArray: Date[] = [];
  const currentDate = initDate;

  while (currentDate <= endDate) {
    dateArray.push(currentDate);
    currentDate.setMinutes(currentDate.getMinutes() + minutes);
  }
  
  return dateArray;
};

export const generateNMonths = (
  initDate: Date = new Date(Date.now()),
  months: number = 1,
  schedule: ScheduleFields[],
  minutes: number = 30
): Date[] => {
  const dateArray: Date[] = [];
  const currentDate = initDate;

  // Define the end date
  const endDate = currentDate;
  endDate.setMonth(endDate.getMonth() + months);

  while (currentDate <= endDate) {
    const currentDay = currentDate.getDay();

    // Find the matching schedule for the current day
    const result = schedule.find(
      (day) => day.initDate.getDay() === currentDay
    );

    if (result) {
      // Extract start and end times from the schedule
      const scheduleStart = currentDate;
      scheduleStart.setHours(result.initDate.getHours(), result.initDate.getMinutes(), 0, 0);

      const scheduleEnd = currentDate;
      scheduleEnd.setHours(result.endDate.getHours(), result.endDate.getMinutes(), 0, 0);

      // Generate dates for this schedule
      dateArray.push(...generateDates(scheduleStart, scheduleEnd, minutes));
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

export const cleanScheduleFunction = (schedule: ScheduleFields[]) => {
  const cleanedSchedule = schedule.map(
    date => ({
      initDate: new Date(
        0, 
        0, 
        date.initDate.getDay(),
        date.initDate.getHours(),
        date.initDate.getMinutes()
      ),
      endDate: new Date(
        0, 
        0, 
        date.endDate.getDay(),
        date.endDate.getHours(),
        date.endDate.getMinutes()
      )
    })
  );

  return cleanedSchedule;
};

export const checkTimeRemaining = (dateToCheck: Date, timeLimit: Date) => {
  const acutalDate = new Date(Date.now());
  if(!timeLimit.getHours()) {
    if(Math.abs(dateToCheck.getMinutes()-acutalDate.getMinutes())
      <= timeLimit.getMinutes())
      return false;
    else 
      return true;
  } else {
    if(Math.abs(
      dateToCheck.getHours() * 60 + dateToCheck.getMinutes()
      - acutalDate.getHours() * 60 + acutalDate.getMinutes())
      <= timeLimit.getHours() * 60 + timeLimit.getMinutes())
      return false;
    else 
      return true;
  }
};
