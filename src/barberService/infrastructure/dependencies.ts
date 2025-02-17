import { CreateBarberService } from "../application/create-barberService";
import { DeleteBarberService } from "../application/delete-barberService";
import { FindBarberService } from "../application/find-barberService";
import { ModifyBarberService } from "../application/modify-barberService";
import { BarberServiceController } from "./barberService-controller";
import { mySQLBarberServiceRepository } from "./barberService-repository-impl";


const barberServiceRepository = new mySQLBarberServiceRepository();

const findBarberService = new FindBarberService(barberServiceRepository);

const createBarberService = new CreateBarberService(barberServiceRepository);

const modifyBarberService = new ModifyBarberService(barberServiceRepository);

const deleteBarberService = new DeleteBarberService(barberServiceRepository);

export const barberServiceController = new BarberServiceController(
  findBarberService,
  createBarberService,
  modifyBarberService,
  deleteBarberService
);