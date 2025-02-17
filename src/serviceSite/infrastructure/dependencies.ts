import { CreateServiceSite } from "../application/create-serviceSite";
import { DeleteServiceSite } from "../application/delete-serviceSite";
import { FindServiceSite } from "../application/find-serviceSite";
import { ModifyServiceSite } from "../application/modify-serviceSite";
import { ServiceSiteController } from "./serviceSite-controller";
import { mySQLServiceSiteRepository } from "./serviceSite-repository-impl";


const serviceSiteRepository = new mySQLServiceSiteRepository();

const findServiceSite = new FindServiceSite(serviceSiteRepository);

const createServiceSite = new CreateServiceSite(serviceSiteRepository);

const modifyServiceSite = new ModifyServiceSite(serviceSiteRepository);

const deleteServiceSite = new DeleteServiceSite(serviceSiteRepository);

export const serviceSiteController = new ServiceSiteController(
  findServiceSite,
  createServiceSite,
  modifyServiceSite,
  deleteServiceSite
);