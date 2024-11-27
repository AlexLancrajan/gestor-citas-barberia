import { CreateBarber } from "../application/create-barber";
import { DeleteBarber } from "../application/delete-barber";
import { FindBarber } from "../application/find-barber";
import { ModifyBarber } from "../application/modify-barber";

import { Request, Response } from "express";
import { BarberInputSchema, BarberModificationSchema } from "./barber-schema";
import { Roles } from "../../user/domain/user";
import { omit } from "lodash";

export class BarberController {
  constructor(
    private readonly findBarber: FindBarber,
    private readonly createBarber: CreateBarber,
    private readonly modifyBarber: ModifyBarber,
    private readonly deleteBarber: DeleteBarber,
  ) { }

  async findBarberFunction(req: Request, res: Response) {
    const barberId = req.params.id;
    const getSite = Boolean(req.query.getSite?.toString().toLowerCase()) || false;

    try {
      const barber = await this.findBarber.runFindBarber(barberId, getSite);
      return res.json(barber);
    } catch (error: unknown) {
      if(error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async findBarbersFunction(req: Request, res: Response) {
    const siteIdRef = Number(req.query.siteIdRef) || -1;
    const page = Number(req.query.page) || 0;
    const pageSize = Number(req.query.pageSize) || 50;
    const getSites = Boolean(req.query.getSites?.toString().toLowerCase()) || false;

    try {
      const barbers = await this.findBarber.runFindBarbers(siteIdRef, page, pageSize, getSites);
      return res.json(barbers);
    } catch (error: unknown) {
      if(error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createBarbersFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if(role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access'});
    }

    const barberInputFields = req.body as BarberInputSchema;
    try {
      const createdBarber = await this.createBarber.run(barberInputFields);
      return createdBarber;
    } catch (error: unknown) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }     
    }
  }

  async modifyBarbersFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if(role !== Roles.admin && role !== Roles.barber) {
      return res.status(401).json({ error: 'Unauthorized access'});
    }

    const barberId = req.params.id;
    const barberInputFields = req.body as BarberModificationSchema;
    try {
      if(role === Roles.barber) {
        const newBarberInputFields = omit(barberInputFields, 'siteIdRef');
        const createdBarber = await this.modifyBarber.run(barberId, newBarberInputFields);
        return createdBarber;
      } else {
        const createdBarber = await this.modifyBarber.run(barberId, barberInputFields);
        return createdBarber;
      }

    } catch (error: unknown) {
      if(error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }     
    }
  }

  async deleteBarbersFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if(!role && role !== Roles.admin) {
      return res.status(401).json({ error: 'Unauthorized access'});
    }

    const barberId = req.params.id;
    try {
      const deletedStatus = await this.deleteBarber.run(barberId);
      return res.json({deletedStatus: deletedStatus});
    } catch (error: unknown) {
      if(error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }     
    }
  }
}