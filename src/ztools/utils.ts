import { ScheduleFields } from '../date/domain/date';
import { Dialect } from 'sequelize';

export const generateDates = (initDate: Date, endDate: Date, minutes: number) => {
  const dateArray: Date[] = [];
  const currentDate = initDate;

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
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
  const currentDate = new Date(initDate);

  // Define the end date
  const endDate = new Date(currentDate);
  endDate.setMonth(endDate.getMonth() + months);

  while (currentDate <= endDate) {
    const currentDay = currentDate.getDay();

    // Find the matching schedule for the current day
    const result = schedule.find(
      (day) => day.initDate.getDay() === currentDay
    );

    if (result) {
      // Extract start and end times from the schedule
      const scheduleStart = new Date(currentDate);
      scheduleStart.setHours(result.initDate.getHours(), result.initDate.getMinutes(), 0, 0);
      
      const scheduleEnd = new Date(currentDate);
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

  const dateArray = schedule.map(
    date => ({
      initDate: new Date(date.initDate),
      endDate: new Date(date.endDate)
    })
  );

  const cleanedSchedule = dateArray
  .map(
    date => ({
      initDate: new Date(
        0, 
        0, 
        date.initDate.getDay(),
        date.initDate.getHours(),
        date.initDate.getMinutes(),
        date.initDate.getSeconds(),
        date.initDate.getMilliseconds()
      ),
      endDate: new Date(
        0, 
        0, 
        date.endDate.getDay(),
        date.endDate.getHours(),
        date.endDate.getMinutes(),
        date.endDate.getSeconds(),
        date.endDate.getMilliseconds()
      )
    })
  );
  return cleanedSchedule;
};

export const checkTimeRemaining = (dateToCheck: Date, timeLimit: Date) => {
  const dateToCheckms = dateToCheck.getTime();
  const actualDatems = Date.now();

  if(Math.abs(dateToCheckms - actualDatems) < timeLimit.getTime()) {
    return false;
  } else {
    return true;
  }
};

export const isDialectType = (input: string): input is Dialect => {
  return ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql', 'db2', 'snowflake', 'oracle'].includes(input);
};
