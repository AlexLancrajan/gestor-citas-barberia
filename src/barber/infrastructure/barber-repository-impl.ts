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
          attributes: {
            exclude: ['createdAt','updatedAt']
          },
          include: [mySQLSite]
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
            exclude: ['siteIdRef','createdAt','updatedAt']
          }
        }
      );

      if(!collectedBarber) return null;
      else return collectedBarber.toJSON();
    }
  }

  async getBarbers(
    siteIdRef: number = -1, 
    page: number = 0, 
    pageSize: number = 50,
    getSites: boolean = false
  ): 
  Promise<BarberFields[] | null> {
    if(siteIdRef === -1) {
      const barbers = await mySQLBarber.findAll(
        {
          limit: pageSize,
          offset: page * pageSize
        }
      );

      if(!barbers) return null;
      else return barbers.map(barbers => barbers.toJSON());
    } else {
      if(getSites){
        const barbers = await mySQLBarber.findAll({
          where: {
            siteIdRef: siteIdRef,
          },
          limit: pageSize,
          offset: page * pageSize,
          include: [mySQLSite],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        });

        if(!barbers) return null;
        else return barbers.map(barbers => barbers.toJSON());
      } else {
        const barbers = await mySQLBarber.findAll({
          where: {
            siteIdRef: siteIdRef,
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
    await this.createBarber(
      {
        barberName: barberInputFields.barberName,
        barberSurname: barberInputFields.barberSurname,
        barberPicture: barberInputFields.barberPicture,
        barberDescription: barberInputFields.barberDescription,
        siteIdRef: barberInputFields.siteIdRef
      }
    );

    const returnedBarber = await mySQLBarber.findOne({
      where: {
        barberName: barberInputFields.barberName
      },
      attributes: {
        exclude: ['createdAt', 'modifiedAt']
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