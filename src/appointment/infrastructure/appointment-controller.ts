import { CreateAppointment } from "../application/create-appointment";
import { DeleteAppointment } from "../application/delete-appointment";
import { FindAppointment } from "../application/find-appointment";
import { ModifyAppointment } from "../application/modify-appointment";
import { UserForToken } from "../../user/domain/user";

import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import options from "../../config";
import { appointmentDates } from "../../middleware";
import { CheckAppointment } from "../application/check-appointment";
import { AppointmentSchema } from "./appointment-schema";

export class AppointmentController {
  constructor(
    private readonly findAppointment: FindAppointment,
    private readonly createAppointment: CreateAppointment,
    private readonly checkAppointment: CheckAppointment,
    private readonly modifyAppointment: ModifyAppointment,
    private readonly deleteAppointment: DeleteAppointment
  ) { }

  async getAppointmentFunction(req: Request, res: Response) {
    const id = Number(req.params.id);

    try {
      const appointment = await this.findAppointment.runAppointment(id);
      return res.json(appointment);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }

  }

  async getAppointmentsFunction(_req: Request, res: Response) {
    try {
      const appointments = await this.findAppointment.runAppointments();
      return appointments;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createAppointmentsFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    if (decodedToken.role !== 'admin') return res.status(401).json({ error: 'Unauthorized access' });

    const { initDate, endDate } = req.body as appointmentDates;
    try {
      const createdAppointments = await this.createAppointment.run(initDate, endDate);
      return createdAppointments;
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async checkAppointmentFunction(req: Request, res: Response) {

    const body = req.body as Date;

    try {
      const appointment = await this.checkAppointment.run(body);
      return res.json(appointment);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async modifyAppointmentFunction(req: Request, res: Response) {
    
    const appointmentId = Number(req.params.id);
    const body = req.body as AppointmentSchema;
    
    try {
      const modifiedAppointment = await this.modifyAppointment.run(appointmentId, body);
      return res.json(modifiedAppointment);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async deleteAppointmentFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    if (decodedToken.role !== 'admin') return res.status(401).json({ error: 'Unauthorized access' });

    const appointmentId = Number(req.params.id);

    try {
      const deletedStatus = await this.deleteAppointment.run(appointmentId);
      return res.json({ status: deletedStatus });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }
}