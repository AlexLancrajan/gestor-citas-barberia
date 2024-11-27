import { CreateDate } from "../application/create-date";
import { DeleteDate } from "../application/delete-date";
import { FindDate } from "../application/find-date";
import { ModifyDate } from "../application/modify-date";
import { Roles } from "../../user/domain/user";
import { Request, Response } from "express";
import { AutomaticDatesSchema, DailyDatesSchema, DateInputSchema, DateModificationSchema, DateNoAvailabilitySchema, OccupationDatesSchema, SiteIdRefSchema } from "./date-schema";
import { cleanScheduleFunction } from "../../ztools/utils";

export class DateController {
  constructor(
    private readonly findDate: FindDate,
    private readonly createDate: CreateDate,
    private readonly modifyDate: ModifyDate,
    private readonly deleteDate: DeleteDate
  ) { }

  async getDateByIdFunction(req: Request, res: Response) {
    const dateId = Number(req.params.id);
    const getSite = Boolean(req.query?.getSite) || false;

    try {
      const date = await this.findDate.runDateById(dateId, getSite);
      return res.json(date);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getDateByDateFunction(req: Request, res: Response) {
    const { dateDate, dateSiteIdRef } = req.body as DateNoAvailabilitySchema;

    try {
      const date = await this.findDate.runDateByDate(
        dateDate, dateSiteIdRef);
      return res.json(date);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getDatesFunction(req: Request, res: Response) {
    const { siteIdRef } = req.body as SiteIdRefSchema;
    const page = Number(req.query?.page) || 0;
    const pageSize = Number(req.query?.pageSize) || 50;
    const getSites = Boolean(req.query?.getSites) || false;

    try {
      const dates = await this.findDate.runDates(
        siteIdRef, page, pageSize, getSites
      );
      return dates;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getOccupationFunction(req: Request, res: Response) {
    const { siteIdRef, initDate, endDate} = req.body as OccupationDatesSchema;

    try {
      const availability = await this.findDate.runOccupation(
        siteIdRef, initDate, endDate
      );
      return res.json({availability: availability});
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createDailyDatesFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) return res.status(401).json({ error: 'Unauthorized access' });

    const { siteIdRef, schedule, minutes } = req.body as DailyDatesSchema;
    const cleanedSchedule = cleanScheduleFunction(schedule);
    try {
      await this.createDate.runCreateDailyDates(
        siteIdRef, cleanedSchedule, minutes
      );
      return res.json({ status: 'Updated' });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createAutomaticDatesFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) return res.status(401).json({ error: 'Unauthorized access' });

    const {
      initDate,
      months,
      schedule,
      minutes,
      siteIdRef
    } = req.body as AutomaticDatesSchema;

    const cleanedSchedule = cleanScheduleFunction(schedule);
    try {
      const createdDates = await this.createDate.runCreateAutomaticDates(
        initDate, months, cleanedSchedule, minutes, siteIdRef);
      return createdDates;
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async createManualDatesFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) return res.status(401).json({ error: 'Unauthorized access' });

    const dateInputFields = req.body as DateInputSchema[];
    try {
      const createdDates = await this.createDate.runCreateManualDates(
        dateInputFields);
      return createdDates;
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async modifyDateFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) return res.status(401).json({ error: 'Unauthorized access' });

    const dateId = Number(req.params.id);
    const body = req.body as DateModificationSchema;
    
    try {
      const modifiedDate = await this.modifyDate.run(dateId, body);
      return res.json(modifiedDate);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async deleteAutomaticDateFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) return res.status(401).json({ error: 'Unauthorized access' });
    
    try {
      await this.deleteDate.runAutomaticDeletion();
      return res.json({ status: 'Completed' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }
  async deleteDateByIdFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) return res.status(401).json({ error: 'Unauthorized access' });

    const dateId = Number(req.params.id);
    try {
      const deletedStatus = await this.deleteDate.runById(dateId);
      return res.json({ status: deletedStatus });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error. ' });
      }
    }
  }

  async deleteDatesFromSiteFunction(req: Request, res: Response) {
    const role = req.userToken?.role.toString().toLowerCase();
    if (role !== Roles.admin) return res.status(401).json({ error: 'Unauthorized access' });

    const { siteIdRef } = req.body as SiteIdRefSchema;
    try {
      const deletedStatus = await this.deleteDate.runBySite(siteIdRef);
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