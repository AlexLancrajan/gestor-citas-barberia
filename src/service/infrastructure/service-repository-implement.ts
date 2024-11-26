import { ServiceRepository } from "../domain/service-repository";
import { Service, ServiceInputFields } from "../domain/service";
import { mySQLBooking, mySQLService, mySQLSite } from "../../mySQL";

export class mySQLServiceRepository implements ServiceRepository {
  async getService(id: number): Promise<Service | null> {
    const service = await mySQLService.findByPk(id, { include: [mySQLBooking, mySQLSite] });

    if (service) return new Service(service.toJSON());
    else return null;
  }

  async getServiceForUsers(serviceId: number): Promise<Service | null> {
    const service = await mySQLService.findByPk(serviceId, { include: [mySQLBooking, mySQLSite], attributes: { exclude: ['bookingRef']} });

    if (service) return new Service(service.toJSON());
    else return null;
  }

  async getServices(): Promise<Service[] | null> {
    const services = await mySQLService.findAll({ include: [mySQLBooking, mySQLSite] });

    if (services) return services.map(service => new Service(service.toJSON()));

    else return null;
  }

  async getServicesForUsers(): Promise<Service[] | null> {
    const services = await mySQLService.findAll({ include: [mySQLBooking, mySQLSite], attributes: { exclude: ['bookingRef']} });

    if (services) return services.map(service => new Service(service.toJSON()));

    else return null;
  }

  async createService(serviceInputFields: ServiceInputFields): Promise<Service | null> {
    const newService = await mySQLService.create({
      serviceType: serviceInputFields.serviceType,
      servicePrice: serviceInputFields.serviceType,
      serviceDuration: serviceInputFields.serviceType,
      serviceDescription: serviceInputFields.serviceType,
      siteId: serviceInputFields.siteId,
    });

    if (newService) return new Service(newService.toJSON());
    else return null;
  }

  async modifyService(serviceId: number, modifiedService: Partial<ServiceInputFields>): Promise<Service> {
    const foundService = await mySQLService.findByPk(serviceId);
    if (!foundService) {
      throw new Error('Could not find the user.');
    }
  
    const updatedUserData: ServiceInputFields = { ...foundService.toJSON(), ...modifiedService };
  
    await mySQLService.update(updatedUserData, { where: { serviceId: serviceId } });
  
    const updatedService = await mySQLService.findByPk(serviceId);
    if (!updatedService) {
      throw new Error('Could not find the modified user.');
    }
    return new Service(updatedService.toJSON());
  }

  async deleteService(id: number): Promise<number> {
    const deletedService = await mySQLService.destroy({ where: { ServiceId: id } });
    return deletedService;
  }
}