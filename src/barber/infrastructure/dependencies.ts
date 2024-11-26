import { CreateBarber } from "../application/create-barber";
import { DeleteBarber } from "../application/delete-barber";
import { FindBarber } from "../application/find-barber";
import { ModifyBarber } from "../application/modify-barber";
import { BarberController } from "./barber-controller";
import { mySQLBarberRepository } from "./barber-repository-impl";


const barberRepository = new mySQLBarberRepository();

const findBarber = new FindBarber(barberRepository);

const createBarber = new CreateBarber(barberRepository);

const modifyBarber = new ModifyBarber(barberRepository);

const deleteBarber = new DeleteBarber(barberRepository);

export const barberController = new BarberController(
  findBarber,
  createBarber,
  modifyBarber,
  deleteBarber
);