import { CreateService } from "../application/create-service";
import { DeleteService } from "../application/delete-service";
import { FindService } from "../application/find-service";
import { ModifyService } from "../application/modify-service";
import { UserForToken } from "../../user/domain/user";
import { ServiceSchema } from "./service-schema";

import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import options from "../../ztools/config";


export class ServiceController {
  constructor(
    private readonly findService: FindService,
    private readonly createService: CreateService,
    private readonly modifyService: ModifyService,
    private readonly deleteService: DeleteService
  ) { }

  async findServiceFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if(!decodedToken) return res.status(401).json({ error: 'Unauthorized access.' });

    const id = Number(req.params.id);
    try {
      if(decodedToken.role === 'admin') {
        const service = await this.findService.runGetService(id);
        return res.json(service);
      } else {
        const service = await this.findService.runGetService(id);
        return res.json(service);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  }

  async findServicesFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if(!decodedToken) return res.status(401).json({ error: 'Unauthorized access.' });

    try {
      if(decodedToken.role === 'admin') {
        const service = await this.findService.runGetServices();
        return res.json(service);
      } else {
        const service = await this.findService.runGetServicesForUsers();
        return res.json(service);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }

  }

  async createServiceFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const serviceFieldsNoId = req.body as ServiceSchema;
    try {
      const createdUser = await this.createService.run(serviceFieldsNoId);
      return res.json(createdUser);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server Error.' });
      }
    }
  }

  async modifyServiceFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const serviceId = Number(req.params.id);
    const modifiedService = req.body as Partial<ServiceSchema>;
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
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (decodedToken.role !== 'admin') {
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