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
          include:[mySQLSite],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          } 
        }
      );
      
      if(!date) return null;
      else return date.toJSON();
    } else {
      const date = 
      await mySQLDate.findByPk(dateId, 
        {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          } 
        }
      );
      
      if(!date) return null;
      else return date.toJSON();
    }
  }

  async getDateByDate(dateToFind: Date, siteIdRef: number): 
  Promise<DateFields | null> {
    const date = 
    await mySQLDate.findOne(
      { 
        where: { 
          dateDate: dateToFind,
          dateSiteIdRef: siteIdRef 
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    );
    
    if(!date) return null;
    else return date.toJSON();
  }

  async getDates(
    siteIdRef: number, 
    page: number, 
    pageSize: number,
    getSites: boolean
  ): Promise<DateFields[] | null> {
    if(getSites && siteIdRef !== -1) {
      const dates = 
      await mySQLDate.findAll(
        {  
          where: {
            dateSiteIdRef: siteIdRef,
          },
          include:[mySQLSite],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
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
          include:[mySQLSite],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
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
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          limit: pageSize,
          offset: page * pageSize
        }
      );

      if(!dates) return null;
      else return dates.map(date => date.toJSON());
    }
  }

  async getOccupation(
    siteIdRef: number,
    initDate: Date,
    endDate: Date
  ): Promise<Availability | null> {
    const dailyDates = await mySQLDate.findAll(
      {
        where: {
          dateSiteIdRef: siteIdRef,
          dateDate: {
            [Op.between]: [initDate, endDate]
          }
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    );
    if(!dailyDates) return null;
    const dailyDatesFields: DateFields[] = dailyDates.map(dates => dates.toJSON());
    const dailyAvailability = dailyDatesFields.map(date => date.dateAvailability);

    const length = dailyAvailability.length;
    const available = dailyAvailability.reduce((sum, value) => {
      if(value === Availability.available) return sum += 1;
      return sum;
    }, 0);

    const percentage = available/length * 100;
    if(percentage < 25) return Availability.available;
    else if(percentage >= 25 && percentage < 50) return Availability.lowOccupied;
    else if(percentage >= 50 && percentage < 75) return Availability.mediumOccupied;
    else if(percentage >= 75 && percentage < 100) return Availability.highlyOccupied;
    else if(percentage === 100) return Availability.full;
    else return null;
  }

  async createDailyDates(
    siteIdRef: number,
    schedule: ScheduleFields[],
    minutes: number
  ): Promise<void> {
    const record = await mySQLDate.findOne({
      where: { dateSiteIdRef: siteIdRef },
      order: [['dateDate', 'DESC']],
    });
    
    if (!record) return;
    const dateFields: DateFields = record.toJSON();
    const currentDay = dateFields.dateDate;

    const result = 
    schedule.find(
      day => day.initDate.getDay() === currentDay.getDay()
    );

    if(result) {
      const initSchedule = currentDay;
      initSchedule
      .setHours(
        result.initDate.getHours(), 
        result.initDate.getMinutes(), 0, 0);

      const endSchedule = currentDay;
      endSchedule
      .setHours(
        result.endDate.getHours(), 
        result.endDate.getMinutes(), 0, 0);
          
      const newDates = generateDates(
        initSchedule, endSchedule, minutes
      );
      const newDateDates = newDates.map(date => ({
        dateDate: date,
        dateAvailability: Availability.available,
        dateSiteIdRef: siteIdRef,
      }));
  
      try{
        await mySQLDate.bulkCreate(newDateDates);
        console.log('Schedule updated!!!');
      } catch(error) {
        console.log(error);
      }
    }
  }

  async createAutomaticDates(
    initDate: Date, 
    months: number, 
    schedule: ScheduleFields[], 
    minutes: number, 
    siteIdRef: number
  ): Promise<DateFields[]> {
    const generatedDates = generateNMonths(initDate, months, schedule, minutes);
    const dates = generatedDates.map(date => 
      ({
        dateDate: date,
        dateAvailability: Availability.available,
        dateSiteIdRef: siteIdRef
      })
    );
    await mySQLDate.bulkCreate(dates);
    
    const datesToVerify = await mySQLDate.findAll(
      {
        where: {
          dateSiteIdRef: siteIdRef
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
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
        dateAvailability: Availability.available,
        dateSiteIdRef: date.dateSiteIdRef
      })
    );
    await mySQLDate.bulkCreate(dates);

    const datesToVerify = await mySQLDate.findAll(
      {
        where: {
          dateSiteIdRef: dateInputFields[0].dateSiteIdRef
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
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
    {...findDate.toJSON(), ...dateInputFields}; 
    await mySQLDate.update(modifiedDateData, 
      { where: { dateId: dateId } });

    const modifiedDate = await mySQLDate.findByPk(dateId,
      {
        attributes: {
          exclude: ['createdAt', 'deletedAt']
        }
      }
    );
    if(!modifiedDate) throw new Error('Could not modify the Date.');

    return modifiedDate.toJSON();
  }

  async deleteDate(): Promise<void> {
    const currentDay = new Date(Date.now());

    const deletedPrevious = await mySQLDate.destroy({
      where: {
        dateDate: {
          [Op.lt]: currentDay
        }
      }
    });
    console.log(deletedPrevious);
  }

  async deleteDateById(dateId: number): Promise<number> {
    const deletedDate = await 
    mySQLDate.destroy({ where: { dateId: dateId } });
    return deletedDate;
  }

  async deleteDatesFromSite(siteIdRef: number): Promise<number> {
    const deletedStatus = await
    mySQLDate.destroy({ where: { dateSiteIdRef: siteIdRef }});
    return deletedStatus;
  }
}