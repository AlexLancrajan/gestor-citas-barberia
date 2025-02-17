import { Request, Response } from "express";
import { CreateServiceSite } from "../application/create-serviceSite";
import { DeleteServiceSite } from "../application/delete-serviceSite";
import { FindServiceSite } from "../application/find-serviceSite";
import { ModifyServiceSite } from "../application/modify-serviceSite";
import { ServiceSiteSchema, CreateServiceSiteSchema } from "./serviceSite-schema";
import { Roles } from "../../user/domain/user";


export class ServiceSiteController {
  constructor(
    private readonly findServiceSite: FindServiceSite,
    private readonly createServiceSite: CreateServiceSite,
    private readonly modifyServiceSite: ModifyServiceSite,
    private readonly deleteServiceSite: DeleteServiceSite
  ) { }

  async findServiceSiteFunction(req: Request, res: Response) {
    const serviceId = Number(req.query.serviceId);
    const siteId = Number(req.query.siteId);

    try {
      const serviceSite = await this.findServiceSite.getServiceSite(
        serviceId, siteId
      );
      return res.json(serviceSite);
    } catch (error: unknown) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }
  }

  async findAllserviceSiteFunction(req: Request, res: Response) {
    const page = Number(req.query?.page) || 0;
    const pageSize = Number(req.query?.pageSize) || 50;

    try {
      const manyserviceSite = await this.findServiceSite.getAllServiceSite(
        page, pageSize
      );
      return res.json(manyserviceSite);
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }
  }

  async createserviceSiteFunction(req: Request, res: Response) {
    const role = req.userToken?.role;
    const serviceSiteFields = req.body as CreateServiceSiteSchema;

    if(role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
      const createdBarber = await this.createServiceSite.run(
        serviceSiteFields
      );
      return res.json(createdBarber);
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }
  }

  async modifyserviceSiteFunction(req: Request, res: Response) {
    const role = req.userToken?.role;
    const serviceId = Number(req.query.serviceId);
    const siteId = Number(req.query.siteId);
    const serviceSiteFields = req.body as ServiceSiteSchema;

    if(role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if(!serviceId && !siteId) {
      return res.status(400).json({ error: 'Missing both barberId, serviceId'});
    }

    try {
      const modifyBarber = await this.modifyServiceSite.run(
        serviceId, siteId, serviceSiteFields
      );
      return res.json(modifyBarber);
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }
  }

  async deleteserviceSiteFuntion(req: Request, res: Response) {
    const role = req.userToken?.role;
    const serviceId = Number(req.query.serviceId);
    const siteId = Number(req.query.siteId);

    if(role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if(!serviceId && !siteId) {
      return res.status(400).json({ error: 'Missing both barberId, serviceId'});
    }

    try {
      const deleteserviceSite = await this.deleteServiceSite.run(
        serviceId, siteId
      );
      return res.json({ deletedStatus: deleteserviceSite});
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }

  }

}