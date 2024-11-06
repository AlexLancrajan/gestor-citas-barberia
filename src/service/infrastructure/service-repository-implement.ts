import { DataTypes, Model, Sequelize } from "sequelize";
import { ServiceRepository } from "../domain/service-repository";
import { Service, ServiceFieldsNoId } from "../domain/service";


class ServiceImplementation extends Model { }

const initServiceModel = (sequelize: Sequelize) => {
  ServiceImplementation.init(
    {
      serviceId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: {
        type: DataTypes.CHAR(30),
        allowNull: false,
        unique: true
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        unique: true
      },
      duration: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'Service'
    }
  );
};

export class mySQLServiceRepository implements ServiceRepository {
  constructor(sequelize: Sequelize) {
    try {
      initServiceModel(sequelize);
      ServiceImplementation.sync().catch(console.error);
    } catch (error: unknown) {
      console.log(error);
    }
  }
  async getService(id: number): Promise<Service | null> {
    const service = await ServiceImplementation.findByPk(id);

    if (service) return new Service(service.toJSON());
    else return null;
  }

  async getServices(): Promise<Service[] | null> {
    const services = await ServiceImplementation.findAll();

    if (services) return services.map(service => new Service(service.toJSON()));

    else return null;
  }

  async createService(ServiceFieldsNoId: ServiceFieldsNoId): Promise<Service> {
    const newService = await ServiceImplementation.create({
      type: ServiceFieldsNoId.type,
      price: ServiceFieldsNoId.price,
      duration: ServiceFieldsNoId.duration,
      description: ServiceFieldsNoId.description
    });

    if (newService) {
      return newService.toJSON();
    } else {
      throw new Error('Failed to create new Service');
    }
  }

  async modifyService(id: number, ServiceFieldsNoId: Partial<ServiceFieldsNoId>): Promise<Service> {
    const findService = await ServiceImplementation.findByPk(id);

    if (findService) {
      const originalService: Service = new Service(findService.toJSON());
      const modifiedService = await ServiceImplementation.update(
        {
          type: ServiceFieldsNoId.type || originalService.serviceFields.type,
          price: ServiceFieldsNoId.price || originalService.serviceFields.price,
          duration: ServiceFieldsNoId.duration || originalService.serviceFields.duration,
          description: ServiceFieldsNoId.description || originalService.serviceFields.description
        },
        { where: { ServiceId: id } }
      );

      if (modifiedService) {
        const newService = await ServiceImplementation.findByPk(id);

        if (newService) return newService.toJSON();
        else throw new Error('Modified service not Found');
      } else {
        throw new Error('Could not modify the service');
      }
    } else {
      throw new Error('Service not found');
    }
  }

  async deleteService(id: number): Promise<number> {
    const deletedService = await ServiceImplementation.destroy({ where: { ServiceId: id } });
    return deletedService;
  }
}