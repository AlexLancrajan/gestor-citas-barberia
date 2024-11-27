import { CreateDate } from '../application/create-date';
import { DeleteDate } from '../application/delete-date';
import { FindDate } from '../application/find-date';
import { ModifyDate } from '../application/modify-date';
import { DateController } from './date-controller';
import { mySQLDateRepository } from "./date-repository-impl";


const dateRepository = new mySQLDateRepository();

const findDate = new FindDate(dateRepository);

const createDate = new CreateDate(dateRepository);

export const modifyDate = new ModifyDate(dateRepository);

const deleteDate = new DeleteDate(dateRepository);

export const dateController = new DateController(
  findDate,
  createDate,
  modifyDate,
  deleteDate
);