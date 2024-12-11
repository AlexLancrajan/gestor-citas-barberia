/**
 * Implementation of the repository of Site for mySQL queries.
 */

import { SiteRepository } from "../domain/site-repository";
import { SiteFields, SiteInputFields } from "../domain/site";
import { mySQLSite } from "../../mySQL";

export class mySQLSiteRepository implements SiteRepository {

  async getSite(id: number): Promise<SiteFields | null> {
    const site = await mySQLSite.findByPk(id, 
      { 
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    );

    if (!site) return null;
    else return site.toJSON();
  }

  async getSites(page: number, pageSize: number): 
  Promise<SiteFields[] | null> {
    const sites = await mySQLSite.findAll(
      { 
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        limit: pageSize,
        offset: page * pageSize,
      }
    );

    if (!sites) return null;

    else return sites.map(site => site.toJSON());
  }

  async createSite(siteInputFields: SiteInputFields): Promise<SiteFields | null> {
    await mySQLSite.create({
      siteName: siteInputFields.siteName,
      siteDirection: siteInputFields.siteDirection,
      siteSchedule: siteInputFields.siteSchedule,
      sitePhone: siteInputFields.sitePhone,
      siteDescription: siteInputFields.siteDescription
    });

    const newSite = await mySQLSite.findOne( {
        where: {
          siteName: siteInputFields.siteName
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    );

    if (newSite) {
      return newSite.toJSON();
    } else {
      return null;
    }
  }

  async modifySite(id: number, siteInputFields: Partial<SiteInputFields>): Promise<SiteFields> {
    const foundSite = await mySQLSite.findByPk(id);
    if(!foundSite) {
      throw new Error('Could not find the site. ');
    }

    const updatedSite: SiteInputFields = { ...foundSite.toJSON(), ...siteInputFields};
    console.log(updatedSite);

    await mySQLSite.update(updatedSite, { where: { siteId: id }});

    const modifiedSite = await mySQLSite.findByPk(id,
      {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      }
    );

    if(!modifiedSite) throw new Error('Could not modify the site.');

    return modifiedSite.toJSON();
  }

  async deleteSite(id: number): Promise<number> {
    const deletedSite = await mySQLSite.destroy({ where: { siteId: id } });
    return deletedSite;
  }
}