import { DateFields, DateInputFields, ScheduleFields } from "../domain/date";
import { DateRepository } from "../domain/date-repository";
import { mySQLDate, mySQLSite } from "../../mySQL";
import { generateDates, generateNMonths } from "../../ztools/utils";
import { Availability } from "../../booking/domain/booking";
import { Op } from "sequelize";

export class mySQLDateRepository implements DateRepository {
  async getDateById(
    dateId: number, 
    getSite: boolean = false
  ): Promise<DateFields | null> {
    if(getSite) {
      const date = 
      await mySQLDate.findByPk(dateId,
        { 
          include:{
            model: mySQLSite,
            attributes: {
              exclude: ['createdAt','updatedAt']
            }
          },
          attributes: {
            exclude: ['siteId']
          } 
        }
      );
      
      if(!date) return null;
      else return date.toJSON();
    } else {
      const date = await mySQLDate.findByPk(dateId);
      if(!date) return null;
      else return date.toJSON();
    }
  }

  async getDateByDate(dateToFind: Date, siteId: number): 
  Promise<DateFields | null> {
    const date = 
    await mySQLDate.findOne(
      { 
        where: { 
          dateDate: dateToFind,
          siteId: siteId 
        },
      }
    );
    
    if(!date) return null;
    else return date.toJSON();
  }

  async getDates(
    siteId: number, 
    page: number, 
    pageSize: number,
    getSites: boolean
  ): Promise<DateFields[] | null> {
    if(getSites && siteId > 0) {
      const dates = 
      await mySQLDate.findAll(
        {  
          where: {
            siteId: siteId,
          },
          include:{
            model: mySQLSite,
            attributes: {
              exclude: ['createdAt','updatedAt']
            }
          },
          attributes: {
            exclude: ['siteId']
          },
          limit: pageSize,
          offset: page * pageSize
        }
      );

      if(!dates) return null;
      else return dates.map(date => date.toJSON());
    } else if(getSites) {
      const dates = 
      await mySQLDate.findAll(
        {  
          attributes: {
            exclude: ['siteId']
          },
          include:{
            model: mySQLSite,
            attributes: {
              exclude: ['createdAt','updatedAt']
            }
          },
          limit: pageSize,
          offset: page * pageSize
        }
      );

      if(!dates) return null;
      else return dates.map(date => date.toJSON());
    } else {
      const dates = 
      await mySQLDate.findAll(
        {  
          limit: pageSize,
          offset: page * pageSize
        }
      );

      if(!dates) return null;
      else return dates.map(date => date.toJSON());
    }
  }

  async getOccupation(
    siteId: number,
    initDate: Date,
    endDate: Date
  ): Promise<Availability | null> {
    const dailyDates = await mySQLDate.findAll(
      {
        where: {
          siteId: siteId,
          dateDate: {
            [Op.between]: [initDate, endDate]
          }
        }
      }
    );
    if(!dailyDates) return null;
    const dailyDatesFields: DateFields[] = dailyDates.map(dates => dates.toJSON());
    const dailyAvailability = dailyDatesFields.map(date => date.dateAvailability);

    const length = dailyAvailability.length;
    const available = dailyAvailability.reduce((sum, value) => {
      if(value.toString() !== Availability.available.toString()){
        return sum += 1;
      } 
      return sum;
    }, 0);

    const percentage = available/length * 100;
    console.log(percentage);
    if(percentage < 25) return Availability.available;
    else if(percentage >= 25 && percentage < 50) return Availability.lowOccupied;
    else if(percentage >= 50 && percentage < 75) return Availability.mediumOccupied;
    else if(percentage >= 75 && percentage < 100) return Availability.highlyOccupied;
    else if(percentage === 100) return Availability.full;
    else return null;
  }

  async createDailyDates(
    siteId: number,
    schedule: ScheduleFields[],
    minutes: number
  ): Promise<void> {
    const record = await mySQLDate.findOne({
      where: { siteId: siteId },
      order: [['dateDate', 'DESC']],
    });
    
    if (!record) return;
    const dateFields: DateFields = record.toJSON();
    const currentDay = new Date(dateFields.dateDate);
    currentDay.setDate(currentDay.getDate()+1);
    
    const result = 
    schedule.find(
      day => day.initDate.getDay() === currentDay.getDay()
    );

    if(result) {
      const initSchedule = new Date(currentDay);
      initSchedule
      .setHours(
        result.initDate.getHours(), 
        result.initDate.getMinutes(), 0, 0);

      const endSchedule = new Date(currentDay);
      endSchedule
      .setHours(
        result.endDate.getHours(), 
        result.endDate.getMinutes(), 0, 0);
          
      const newDates = generateDates(
        initSchedule, endSchedule, minutes
      );
      const newDateDates = newDates.map(date => ({
        dateDate: date,
        dateAvailability: Availability.available.toString(),
        dateSiteId: siteId,
      }));
  
      try{
        await mySQLDate.bulkCreate(newDateDates);
        console.log('New day added succesfully!');
      } catch(error) {
        console.log(error);
      }
    } else {
      console.log('New day could not be added!');
    }
  }

  async createAutomaticDates(
    initDate: Date, 
    months: number, 
    schedule: ScheduleFields[], 
    minutes: number, 
    siteId: number
  ): Promise<DateFields[]> {
    const generatedDates = generateNMonths(initDate, months, schedule, minutes);
    const dates = generatedDates.map(date => 
      ({
        dateDate: date,
        dateAvailability: Availability.available.toString(),
        siteId: siteId
      })
    );
    await mySQLDate.bulkCreate(dates);
    
    const datesToVerify = await mySQLDate.findAll(
      {
        where: {
          siteId: siteId
        }
      }
    );

    if(!datesToVerify) throw new Error('Could not create the automated dates.');
    return datesToVerify.map(date => date.toJSON());
  }
  async createManualDates(
    dateInputFields: DateInputFields[]): Promise<DateFields[]> {
    const dates = dateInputFields.map(date => 
      ({
        dateDate: date.dateDate,
        dateAvailability: date.dateAvailability.toString(),
        siteId: date.siteId
      })
    );
    await mySQLDate.bulkCreate(dates);

    const datesToVerify = await mySQLDate.findAll(
      {
        where: {
          siteId: dateInputFields[0].siteId
        }
      }
    );

    if(!datesToVerify) throw new Error('Could not create the automated dates.');
    return datesToVerify.map(date => date.toJSON());
  }

  async modifyDate(
    dateId: number, 
    dateInputFields: DateInputFields
  ): Promise<DateFields> {
    const findDate = await mySQLDate.findByPk(dateId);
    if (!findDate) throw new Error('Could find the Date.');

    const modifiedDateData: DateInputFields = 
    {
      ...findDate.toJSON(), 
      ...dateInputFields,
    };
    const modifiedDateCleaned = {
      ... modifiedDateData,
      dateAvailability: modifiedDateData.dateAvailability.toString()
    };
    
    await mySQLDate.update(modifiedDateCleaned, 
      { where: { dateId: dateId } });

    const modifiedDate = await mySQLDate.findByPk(dateId);
    if(!modifiedDate) throw new Error('Could not modify the Date.');

    return modifiedDate.toJSON();
  }

  async deleteDate(): Promise<number> {
    const currentDay = new Date(Date.now());

    const deletedPrevious = await mySQLDate.destroy({
      where: {
        dateDate: {
          [Op.lt]: currentDay
        }
      }
    });
    return deletedPrevious;
  }

  async deleteDateById(dateId: number): Promise<number> {
    const deletedDate = await 
    mySQLDate.destroy({ where: { dateId: dateId } });
    return deletedDate;
  }

  async deleteDatesFromSite(siteId: number): Promise<number> {
    if(siteId === -1) {
      return -1;
    } else {
      const deletedStatus = await
      mySQLDate.destroy({ where: { siteId: siteId }});
      return deletedStatus;
    }

  }
}