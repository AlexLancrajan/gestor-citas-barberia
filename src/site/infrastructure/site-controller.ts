/**
 * Supported functionality for site is:
 * 1. Find site and realte info such as appointments, bookings, barbers, users depending
 * on the access level (admin or user).
 * 2. Create Site (admin level).
 * 3. Modify Site (admin level).
 * 4. Delete Site (admin level).
 */

import { CreateSite } from "../application/create-site";
import { DeleteSite } from "../application/delete-site";
import { FindSite } from "../application/find-site";
import { ModifySite } from "../application/modify-site";
import { UserForToken } from "../../user/domain/user";
import { SiteSchema } from "./site-schema";
import options from "../../ztools/config";

import { Request, Response } from "express";
import jwt from 'jsonwebtoken';


export class SiteController {
  constructor(
    private readonly findSite: FindSite,
    private readonly deleteSite: DeleteSite,
    private readonly createSite: CreateSite,
    private readonly modifySite: ModifySite
  ) { }

  async findSiteFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if(!decodedToken) return res.status(401).json({ error: 'Unauthorized access.' });

    const id = Number(req.params.id);
    try {
      if (decodedToken.role === 'admin') {
        const site = await this.findSite.runGetSite(id);
        return res.json(site);
      } else {
        const site = await this.findSite.runGetSiteForUsers(id);
        return res.json(site);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal Server error ' });
      }
    }
  }

  async findSitesFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if(!decodedToken) return res.status(401).json({ error: 'Unauthorized access.' });

    try {
      if (decodedToken.role === 'admin') {
        const site = await this.findSite.runGetSites();
        return res.json(site);
      } else {
        const site = await this.findSite.runGetSitesForUsers();
        return res.json(site);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.json(500).json({ error: 'Internal Server error' });
      }
    }
  }

  async createSiteFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;
    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const siteInputFields = req.body as SiteSchema;
    try {
      const createdSite = await this.createSite.run(siteInputFields);
      return res.json(createdSite);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.json(500).json({ error: 'Internal Server error' });
      }
    }
  }

  async modifySiteFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const siteId = Number(req.params.id);
    const siteFieldsNoId = req.body as SiteSchema;
    try {
      const modifiedSite = await this.modifySite.run(siteId, siteFieldsNoId);
      return modifiedSite;
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.json(500).json({ error: 'Internal Server error' });
      }
    }
  }

  async deleteSiteFunction(req: Request, res: Response) {
    const decodedToken = jwt.verify(req.params.token, options.ACCESS_TOKEN_SECRET as jwt.Secret) as UserForToken;

    if (decodedToken.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access.' });
    }

    const id = Number(req.params.id);
    try {
      const deletedStatus = await this.deleteSite.run(id);
      return res.json({ status: deletedStatus });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(404).json({ error: error.message });
      } else {
        return res.json(500).json({ error: 'Internal Server error' });
      }
    }
  }
}