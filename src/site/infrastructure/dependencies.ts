import { sequelize } from '../../app';
import { CreateSite } from '../application/create-site';
import { DeleteSite } from '../application/delete-site';
import { FindSite } from '../application/find-site';
import { ModifySite } from '../application/modify-site';
import { SiteController } from './site-controller';
import { mySQLSiteRepository } from "./site-repository-implement";


const siteRepository = new mySQLSiteRepository(sequelize);

const createSite = new CreateSite(siteRepository);

const deleteSite = new DeleteSite(siteRepository);

const findSite = new FindSite(siteRepository);

const modifySite = new ModifySite(siteRepository);

export const siteController = new SiteController(
  findSite,
  deleteSite,
  createSite,
  modifySite
);

