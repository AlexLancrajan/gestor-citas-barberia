/**
 * Implementation of the repository of Site for mySQL queries.
 */

import { SiteRepository } from "../domain/site-repository";
import { Site, SiteInputFields } from "../domain/site";
import { mySQLDate, mySQLBooking, mySQLService, mySQLSite, mySQLUser } from "../../mySQL";

export class mySQLSiteRepository implements SiteRepository {

  async getSite(id: number): Promise<Site | null> {
    const site = await mySQLSite.findByPk(id, { include: [mySQLService, mySQLDate, mySQLBooking, mySQLUser] });

    if (!site) return null;
    else return new Site(site.toJSON());
  }

  async getSiteForUsers(id: number): Promise<Site | null> {
    const site = await mySQLSite.findByPk(id, { include: [mySQLService, mySQLDate, mySQLUser], attributes: { exclude: ['bookingRef']} });

    if (!site) return null;
    else return new Site(site.toJSON());
  }

  async getSites(): Promise<Site[] | null> {
    const sites = await mySQLSite.findAll({ include: [mySQLService, mySQLDate, mySQLBooking, mySQLUser], attributes: { exclude: ['bookingRef']} });

    if (!sites) return null;

    else return sites.map(site => new Site(site.toJSON()));
  }

  async getSitesForUsers(): Promise<Site[] | null> {
    const sites = await mySQLSite.findAll({ include: [mySQLService, mySQLDate, mySQLUser] });

    if (!sites) return null;

    else return sites.map(site => new Site(site.toJSON()));
  }

  async createSite(siteInputFields: Partial<SiteInputFields>): Promise<Site | null> {
    const newSite = await mySQLSite.create({
      siteName: siteInputFields.siteName,
      siteDirection: siteInputFields.siteDirection,
      siteSchedule: siteInputFields.siteSchedule,
      siteDescription: siteInputFields.siteDescription
    });

    if (newSite) {
      return new Site(newSite.toJSON());
    } else {
      return null;
    }
  }

  async modifySite(id: number, siteInputFields: Partial<SiteInputFields>): Promise<Site> {
    const foundSite = await mySQLSite.findByPk(id);
    if(!foundSite) {
      throw new Error('Could not find the site. ');
    }

    const updatedSite: SiteInputFields = { ...foundSite.toJSON(), ...siteInputFields};

    await mySQLSite.update(updatedSite, { where: { siteId: id }});

    const modifiedSite = await mySQLSite.findByPk(id);
    if(!modifiedSite) throw new Error('Could not modify the site.');

    return new Site(modifiedSite.toJSON());
  }

  async deleteSite(id: number): Promise<number> {
    const deletedSite = await mySQLSite.destroy({ where: { siteId: id } });
    return deletedSite;
  }
}