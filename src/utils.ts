export const generateDates = (initDate: Date, endDate: Date) => {
  const dateArray = [];

  const currentDate = initDate;
  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setMinutes(currentDate.getMinutes() + 30);
  }

  return dateArray;
};