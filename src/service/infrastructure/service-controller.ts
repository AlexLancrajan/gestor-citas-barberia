import { CreateService } from "../application/create-service";
import { DeleteService } from "../application/delete-service";
import { FindService } from "../application/find-service";
import { ModifyService } from "../application/modify-service";
import { Roles } from "../../user/domain/user";
import { ServiceModificationSchema, ServiceSchema } from "./service-schema";

import { Request, Response } from "express";

export class ServiceController {
  constructor(
    private readonly findService: FindService,
    private readonly createService: CreateService,
    private readonly modifyService: ModifyService,
    private readonly deleteService: DeleteService
  ) { }

  async findServiceFunction(req: Request, res: Response) {
    const serviceId = Number(req.params.id);
    try {
        const service = await this.findService.runGetService(serviceId);
        return res.json(service);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  }

  async findServicesFunction(req: Request, res: Response) {
    const page = Number(req.query.page) || 0;
    const pageSize = Number(req.query.pageSize) || 50;
    try {
        const service = await this.findService.runGetServices(page, pageSize);
        return res.json(service);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  }

  async createServiceFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const serviceFieldsNoId = req.body as ServiceSchema;
    try {
      const createdService = await this.createService.run(serviceFieldsNoId);
      return res.json(createdService);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  }

  async modifyServiceFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const serviceId = Number(req.params.id);
    const modifiedService = req.body as ServiceModificationSchema;
    try {
      const newService = await this.modifyService.run(serviceId, modifiedService);
      return res.json(newService);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  }

  async deleteServiceFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const serviceId = Number(req.params.id);
    try {
      const deletedStatus = await this.deleteService.run(serviceId);
      return res.json({ status: deletedStatus });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  }
}