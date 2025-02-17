import { mySQLBarberService } from "../../mySQL";
import { barberService } from "../domain/barberService";
import { barberServiceRepository } from "../domain/barberService-repository";


export class mySQLBarberServiceRepository implements barberServiceRepository {
  async getbarberService(barberId: string | undefined, serviceId: number | undefined): Promise<barberService | null> {
    const barberService = await mySQLBarberService.findOne({
      where: {
        barberId: barberId,
        serviceId: serviceId
      }
    });

    if(!barberService) return null;
    return barberService.toJSON();
  }

  async getAllbarberService(page: number, pageSize: number): Promise<barberService[] | null> {
    const barberService = await mySQLBarberService.findAll({
      limit: pageSize,
      offset: page * pageSize
    });

    if(!barberService) return null;
    
    return barberService.map(barberService => barberService.toJSON());
  }

  async createBarberService(barberServiceInput: barberService): Promise<barberService> {
    await mySQLBarberService.create(
      {
        barberId: barberServiceInput.barberId,
        serviceId: barberServiceInput.serviceId
      }
    );

    const createdBarber = await mySQLBarberService.findOne({
      where: {
        barberId: barberServiceInput.barberId,
        serviceId: barberServiceInput.serviceId
      }
    });
    if(!createdBarber) throw new Error('Could not create barberService relation');
    return createdBarber.toJSON();
  }

  async modifyBarberService(
    barberId: string, 
    serviceId: number, 
    barberServiceInput: Partial<barberService>): Promise<barberService> {
    const foundBarberService = await mySQLBarberService.findOne(
      {
        where: {
          barberId: barberId,
          serviceId: serviceId
        }
      }
    );
    if(!foundBarberService) throw new Error('Barber not found');
    const updatedBarberData: barberService = {
      ...foundBarberService.toJSON(), ...barberServiceInput
    };
    await mySQLBarberService.update(
      updatedBarberData,
      {
        where: {
          barberId: barberId,
          serviceId: serviceId
        }
      }
    );
    const updatedBarberService = await mySQLBarberService.findOne(
      {
        where: {
          barberId: updatedBarberData.barberId,
          serviceId: updatedBarberData.serviceId
        }
      }
    );
    if(!updatedBarberService) throw new Error('Error modifying barber.');
    return updatedBarberService.toJSON();
  }

  async deleteBarberService(barberId: string, serviceId: number): Promise<number> {
    const deletedStatus = await mySQLBarberService.destroy(
      {
        where: {
          barberId: barberId,
          serviceId: serviceId
        }
      }
    );
    return deletedStatus;
  }

}