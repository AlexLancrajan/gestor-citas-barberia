import { mySQLServiceRepository } from './service-repository-implement';
import { FindService } from '../application/find-service';
import { CreateService } from '../application/create-service';
import { ModifyService } from '../application/modify-service';
import { DeleteService } from '../application/delete-service';
import { ServiceController } from './service-controller';

const serviceRepository = new mySQLServiceRepository();

const findService = new FindService(serviceRepository);

const createService = new CreateService(serviceRepository);

const modifyService = new ModifyService(serviceRepository);

const deleteService = new DeleteService(serviceRepository);

export const serviceController = new ServiceController(
  findService,
  createService,
  modifyService,
  deleteService
);