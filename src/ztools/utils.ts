import { ScheduleFields } from '../date/domain/date';
import { Dialect } from 'sequelize';
import options from './config';

/**It creates dates given two date boundries and a time step. Used for generateNMonths function. */
export const generateDates = (initDate: Date, endDate: Date, minutes: number) => {
  const dateArray: Date[] = [];
  const currentDate = initDate;

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setMinutes(currentDate.getMinutes() + minutes);
  }
  
  return dateArray;
};

/**It generates automatic dates for a given site. */
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
      (day) => day.openTime.getDay() === currentDay
    );

    if (result) {
      // Extract start and end times from the schedule
      const scheduleStart = new Date(currentDate);
      scheduleStart.setHours(result.openTime.getHours(), result.openTime.getMinutes(), 0, 0);
      
      const scheduleEnd = new Date(currentDate);
      scheduleEnd.setHours(result.closeTime.getHours(), result.closeTime.getMinutes(), 0, 0);

      // Generate dates for this schedule
      dateArray.push(...generateDates(scheduleStart, scheduleEnd, minutes));
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

/**It performs schedule cleaning to eliminate the years and months for the generateNMonths function. */
export const cleanScheduleFunction = (schedule: ScheduleFields[]) => {

  const dateArray = schedule.map(
    date => ({
      openTime: new Date(date.openTime),
      closeTime: new Date(date.closeTime)
    })
  );

  const cleanedSchedule = dateArray
  .map(
    date => ({
      openTime: new Date(
        0, 
        0, 
        date.openTime.getDay(),
        date.openTime.getHours(),
        date.openTime.getMinutes(),
        date.openTime.getSeconds(),
        date.openTime.getMilliseconds()
      ),
      closeTime: new Date(
        0, 
        0, 
        date.closeTime.getDay(),
        date.closeTime.getHours(),
        date.closeTime.getMinutes(),
        date.closeTime.getSeconds(),
        date.closeTime.getMilliseconds()
      )
    })
  );
  return cleanedSchedule;
};

/**Used for checking cancelation time limits imposed by a particular site. */
export const checkTimeRemaining = (dateToCheck: Date, timeLimit: Date) => {
  const dateToCheckms = dateToCheck.getTime();
  const actualDatems = Date.now();

  if(Math.abs(dateToCheckms - actualDatems) < timeLimit.getTime()) {
    return false;
  } else {
    return true;
  }
};

/**Used for changing timeLimit field from options. */
export const setTimeLimits = (hours: number = 0, minutes: number = 30) => {
  options.timeLimit = new Date(0,0,0,hours,minutes,0,0);
};

export const isDialectType = (input: string): input is Dialect => {
  return ['mysql', 'postgres', 'sqlite', 'mariadb', 'mssql', 'db2', 'snowflake', 'oracle'].includes(input);
};
