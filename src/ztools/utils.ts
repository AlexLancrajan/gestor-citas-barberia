export const generateDates = (initDate: Date, endDate: Date, minutes: number) => {
  const dateArray: Date[] = [];

  const currentDate = initDate;
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setMinutes(currentDate.getMinutes() + minutes);
  }
  
  return dateArray;
};