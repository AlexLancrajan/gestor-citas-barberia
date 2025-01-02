import { ServiceRepository } from "../domain/service-repository";
import { ServiceFields, ServiceInputFields } from "../domain/service";
import { mySQLService } from "../../mySQL";

export class mySQLServiceRepository implements ServiceRepository {
  async getService(id: number): Promise<ServiceFields | null> {
    const service = await mySQLService.findByPk(id, 
      { 
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
     }
    );

    if (service) return service.toJSON();
    else return null;
  }

  async getServices(siteId: number | undefined, page: number, pageSize: number): Promise<ServiceFields[] | null> {
    if(siteId) {
      const services = await mySQLService.findAll(
        { 
          where: {
            siteId: siteId
          }, 
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          limit: pageSize,
          offset: page * pageSize,
        }
      );
      if(!services) return null;
      else return services.map(service => service.toJSON());
    } else {
      const services = await mySQLService.findAll(
        { 
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          limit: pageSize,
          offset: page * pageSize,
        }
      );
      if(!services) return null;
      else return services.map(service => service.toJSON());
    }
  }

  async createService(serviceInputFields: ServiceInputFields): Promise<ServiceFields> {
    await mySQLService.create({
      serviceType: serviceInputFields.serviceType,
      servicePrice: serviceInputFields.servicePrice,
      serviceDuration: serviceInputFields.serviceDuration,
      serviceDescription: serviceInputFields.serviceDescription,
      siteId: serviceInputFields.siteId
    });

    const newService = await mySQLService.findOne( 
      {
        where: {
          serviceType: serviceInputFields.serviceType,
          siteId: serviceInputFields.siteId
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
     }
    );

    if (!newService) throw new Error('Could not create service');
    return newService.toJSON();
  }

  async modifyService(serviceId: number, modifiedService: Partial<ServiceInputFields>): Promise<ServiceFields> {
    const foundService = await mySQLService.findByPk(serviceId);
    if (!foundService) {
      throw new Error('Could not find the service.');
    }
  
    const updatedUserData: ServiceInputFields = { ...foundService.toJSON(), ...modifiedService };
  
    await mySQLService.update(updatedUserData, { where: { serviceId: serviceId } });
  
    const updatedService = await mySQLService.findByPk(serviceId,
      {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    );
    if (!updatedService) {
      throw new Error('Could not find the modified service.');
    }
    return updatedService.toJSON();
  }

  async deleteService(id: number): Promise<number> {
    const deletedService = await mySQLService.destroy({ where: { ServiceId: id } });
    return deletedService;
  }
}