import { DataTypes, Model, Sequelize } from "sequelize";
import { SiteRepository } from "../domain/site-repository";
import { Site, SiteFieldsNoId } from "../domain/site";

class SiteImplementation extends Model { }

const initSiteModel = (sequelize: Sequelize) => {
  SiteImplementation.init(
    {
      siteId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.CHAR(30),
        allowNull: false,
        unique: true
      },
      direction: {
        type: DataTypes.CHAR(80),
        allowNull: false,
        unique: true
      },
      schedule: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      }
    },
    {
      sequelize,
      modelName: 'Site'
    }
  );
};

export class mySQLSiteRepository implements SiteRepository {
  constructor(sequelize: Sequelize) {
    try {
      initSiteModel(sequelize);
      SiteImplementation.sync().catch(console.error);
    } catch (error: unknown) {
      console.log(error);
    }
  }
  async getSite(id: number): Promise<Site | null> {
    const site = await SiteImplementation.findByPk(id);

    if (site) return new Site(site.toJSON());
    else return null;
  }
  async getSites(): Promise<Site[] | null> {
    const sites = await SiteImplementation.findAll();

    if (sites) return sites.map(site => new Site(site.toJSON()));

    else return null;
  }
  async createSite(siteFieldsNoId: SiteFieldsNoId): Promise<Site> {
    const newSite = await SiteImplementation.create({
      name: siteFieldsNoId.name,
      direction: siteFieldsNoId.direction,
      schedule: siteFieldsNoId.schedule,
      description: siteFieldsNoId.description
    });

    if (newSite) {
      return newSite.toJSON();
    } else {
      throw new Error('Failed to create new Site');
    }
  }
  async modifySite(id: number, siteFieldsNoId: Partial<SiteFieldsNoId>): Promise<Site> {
    const findSite = await SiteImplementation.findByPk(id);

    if (findSite) {
      const originalSite: Site = new Site(findSite.toJSON());
      const modifiedSite = await SiteImplementation.update(
        {
          name: siteFieldsNoId.name || originalSite.siteFields.name,
          direction: siteFieldsNoId.direction || originalSite.siteFields.direction,
          schedule: siteFieldsNoId.schedule || originalSite.siteFields.schedule,
          description: siteFieldsNoId.description || originalSite.siteFields.description
        },
        { where: { siteId: id } }
      );

      if (modifiedSite) {
        const newSite = await SiteImplementation.findByPk(id);

        if (newSite) return newSite.toJSON();
        else throw new Error('Modified Site not Found');
      } else {
        throw new Error('Could not modify the Site');
      }
    } else {
      throw new Error('Site not found');
    }
  }
  async deleteSite(id: number): Promise<number> {
    const deletedSite = await SiteImplementation.destroy({ where: { siteId: id } });
    return deletedSite;
  }
}