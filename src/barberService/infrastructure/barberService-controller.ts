import { Request, Response } from "express";
import { CreateBarberService } from "../application/create-barberService";
import { DeleteBarberService } from "../application/delete-barberService";
import { FindBarberService } from "../application/find-barberService";
import { ModifyBarberService } from "../application/modify-barberService";
import { BarberServiceSchema, CreateBarberServiceSchema } from "./barberService-schema";
import { Roles } from "../../user/domain/user";


export class BarberServiceController {
  constructor(
    private readonly findBarberService: FindBarberService,
    private readonly createBarberService: CreateBarberService,
    private readonly modifyBarberService: ModifyBarberService,
    private readonly deleteBarberService: DeleteBarberService
  ) { }

  async findBarberServiceFunction(req: Request, res: Response) {
    const barberId = String(req.query?.barberId);
    const serviceId = Number(req.query.serviceId);

    try {
      const barberService = await this.findBarberService.getBarberService(
        barberId, serviceId
      );
      return res.json(barberService);
    } catch (error: unknown) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }
  }

  async findAllBarberServiceFunction(req: Request, res: Response) {
    const page = Number(req.query?.page) || 0;
    const pageSize = Number(req.query?.pageSize) || 50;

    try {
      const manyBarberService = await this.findBarberService.getAllBarberService(
        page, pageSize
      );
      return res.json(manyBarberService);
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }
  }

  async createBarberServiceFunction(req: Request, res: Response) {
    const role = req.userToken?.role;
    const barberServiceFields = req.body as CreateBarberServiceSchema;

    if(role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    try {
      const createdBarber = await this.createBarberService.run(
        barberServiceFields
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

  async modifyBarberServiceFunction(req: Request, res: Response) {
    const role = req.userToken?.role;
    const barberId = String(req.query?.barberId);
    const serviceId = Number(req.query.serviceId);
    const barberServiceFields = req.body as BarberServiceSchema;

    if(role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if(!barberId && !serviceId) {
      return res.status(400).json({ error: 'Missing both barberId, serviceId'});
    }

    try {
      const modifyBarber = await this.modifyBarberService.run(
        barberId, serviceId, barberServiceFields
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

  async deleteBarberServiceFuntion(req: Request, res: Response) {
    const role = req.userToken?.role;
    const barberId = String(req.query?.barberId);
    const serviceId = Number(req.query?.serviceId);

    if(role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    if(!barberId && !serviceId) {
      return res.status(400).json({ error: 'Missing both barberId, serviceId'});
    }

    try {
      const deleteBarberService = await this.deleteBarberService.run(
        barberId, serviceId
      );
      return res.json({ deletedStatus: deleteBarberService});
    } catch (error) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error});
      } else {
        return res.status(500).json({ error: 'Internal Server Error'});
      }
    }

  }

}