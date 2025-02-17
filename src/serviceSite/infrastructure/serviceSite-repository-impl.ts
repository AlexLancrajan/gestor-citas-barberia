import { mySQLServiceSite } from "../../mySQL";
import { serviceSite } from "../domain/serviceSite";
import { serviceSiteRepository } from "../domain/serviceSite-repository";


export class mySQLServiceSiteRepository implements serviceSiteRepository {
  async getServiceSite(
    serviceId: number | undefined,
    siteId: number | undefined
  ): Promise<serviceSite | null> {
    const serviceSite = await mySQLServiceSite.findOne({
      where: {
        serviceId: serviceId,
        siteId: siteId,
      }
    });

    if(!serviceSite) return null;
    return serviceSite.toJSON();
  }

  async getAllServiceSite(page: number, pageSize: number): Promise<serviceSite[] | null> {
    const serviceSite = await mySQLServiceSite.findAll({
      limit: pageSize,
      offset: page * pageSize
    });

    if(!serviceSite) return null;
    
    return serviceSite.map(serviceSite => serviceSite.toJSON());
  }

  async createServiceSite(serviceSiteInput: serviceSite): Promise<serviceSite> {
    await mySQLServiceSite.create(
      {
        serviceId: serviceSiteInput.serviceId,
        siteId: serviceSiteInput.siteId,
      }
    );

    const createdBarber = await mySQLServiceSite.findOne({
      where: {
        serviceId: serviceSiteInput.serviceId,
        siteId: serviceSiteInput.siteId,
      }
    });
    if(!createdBarber) throw new Error('Could not create serviceSite relation');
    return createdBarber.toJSON();
  }

  async modifyServiceSite(
    serviceId: number, 
    siteId: number, 
    serviceSiteInput: Partial<serviceSite>): Promise<serviceSite> {
    const foundServiceSite = await mySQLServiceSite.findOne(
      {
        where: {
          serviceId: serviceId,
          siteId: siteId,
        }
      }
    );
    if(!foundServiceSite) throw new Error('Barber not found');
    const updatedBarberData: serviceSite = {
      ...foundServiceSite.toJSON(), ...serviceSiteInput
    };
    await mySQLServiceSite.update(
      updatedBarberData,
      {
        where: {
          serviceId: serviceId,
          siteId: siteId,
        }
      }
    );
    const updatedServiceSite = await mySQLServiceSite.findOne(
      {
        where: {
          serviceId: updatedBarberData.serviceId,
          siteId: updatedBarberData.siteId,
        }
      }
    );
    if(!updatedServiceSite) throw new Error('Error modifying barber.');
    return updatedServiceSite.toJSON();
  }

  async deleteServiceSite(serviceId: number, siteId: number): Promise<number> {
    const deletedStatus = await mySQLServiceSite.destroy(
      {
        where: {
          serviceId: serviceId,
          siteId: siteId,
        }
      }
    );
    return deletedStatus;
  }

}