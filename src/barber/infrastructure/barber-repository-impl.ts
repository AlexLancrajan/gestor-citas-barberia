import { mySQLBarber, mySQLSite } from "../../mySQL";
import { BarberFields, BarberInputFields } from "../domain/barber";
import { BarberRepository } from "../domain/barber-repository";


export class mySQLBarberRepository implements BarberRepository{
  async getBarber(barberId: string, getSite: boolean = false): 
  Promise<BarberFields | null> {
    if(getSite) {
      const collectedBarber = await
      mySQLBarber.findByPk(
        barberId, 
        {
          include: {
            model: mySQLSite,
            attributes: {
              exclude: ['createdAt','updatedAt']
            }
          },
          attributes: {
            exclude: ['siteId','createdAt','updatedAt']
          },
        }
      );

      if(!collectedBarber) return null;
      else return collectedBarber.toJSON();
    } else {
      const collectedBarber = await
      mySQLBarber.findByPk(
        barberId, 
        {
          attributes: {
            exclude: ['createdAt','updatedAt']
          }
        }
      );

      if(!collectedBarber) return null;
      else return collectedBarber.toJSON();
    }
  }

  async getBarbers(
    siteId: number = -1, 
    page: number = 0, 
    pageSize: number = 50,
    getSites: boolean = false
  ): 
  Promise<BarberFields[] | null> {
    if(siteId === -1 && !getSites) {
      const barbers = await mySQLBarber.findAll(
        {
          limit: pageSize,
          offset: page * pageSize,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      );

      if(!barbers) return null;
      else return barbers.map(barbers => barbers.toJSON());
    } else {
      if(getSites){
        const barbers = await mySQLBarber.findAll({
          limit: pageSize,
          offset: page * pageSize,
          include: {
            model: mySQLSite,
            attributes: {
              exclude: ['createdAt','updatedAt']
            }
          },
          attributes: {
            exclude: ['siteId','createdAt', 'updatedAt']
          }
        });

        if(!barbers) return null;
        else return barbers.map(barbers => barbers.toJSON());
      } else {
        const barbers = await mySQLBarber.findAll({
          where: {
            siteId: siteId,
          },
          limit: pageSize,
          offset: page * pageSize,
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        });

        if(!barbers) return null;
        else return barbers.map(barbers => barbers.toJSON());
      }
    }
  }
  async createBarber(barberInputFields: BarberInputFields): 
  Promise<BarberFields> {
    await mySQLBarber.create(
      {
        barberName: barberInputFields.barberName,
        barberSurname: barberInputFields.barberSurname,
        barberPicture: barberInputFields.barberPicture,
        barberDescription: barberInputFields.barberDescription,
        siteId: barberInputFields.siteId
      }
    );

    const returnedBarber = await mySQLBarber.findOne({
      where: {
        barberPicture: barberInputFields.barberPicture
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if(!returnedBarber) throw new Error('Could not create a new barber');
    else return returnedBarber.toJSON();
  }

  async modifyBarber(barberId: string, barberInputFields: Partial<BarberInputFields>): Promise<BarberFields[]> {
    const foundBarber = await mySQLBarber.findByPk(barberId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });
    if(!foundBarber) throw new Error('Barber not found');

    const updatedBarberData: BarberInputFields = {
      ...foundBarber.toJSON(), ...barberInputFields
    };

    await mySQLBarber.update(
      updatedBarberData,
      {
        where: {
          barberId: barberId,
        }
      }
    );

    const updatedBarber = await mySQLBarber.findByPk(barberId, {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    });

    if(!updatedBarber) throw new Error('Error modifying barber.');
    return updatedBarber.toJSON();
  }
  
  async deleteBarber(barberId: string): Promise<number> {
    const deletedStatus = await mySQLBarber.destroy(
      {
        where: {
          barberId: barberId
        }
      }
    );
    return deletedStatus;
  }

}