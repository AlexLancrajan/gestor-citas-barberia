import { UUIDV4 } from "sequelize";
import { Availability } from "./booking/domain/booking";
import options from "./ztools/config";
import { Sequelize, DataTypes } from "sequelize";
import { isDialectType } from "./ztools/utils";

// Create an instance of Sequelize connection with mySQL setup.
const sequelize = new Sequelize(
  options.databaseName,
  options.databaseUser,
  options.databasePassword,
  {
    host: options.databaseHost,
    dialect: isDialectType(options.databaseDialect) ? options.databaseDialect : 'mysql',
    logging: (msg, executionTime) => {
      const time = (typeof executionTime === 'number') ? executionTime : 'unknown';
      console.log(`Query executed in ${time}ms: ${msg}`);
    },
    benchmark: true,
  }
);

/**
 * In order to create the table with the required concepts, which are: User, Barber, Site, Service, Booking, Date and Payment.
 * Each concepts will have their respective datafields and relations among them.
 */

/**
 * First concept defined is User, which has the following fields:
 * 1. userId: Set as primary key and uses an UUID data type for security purposes.
 * 2. username: Identifies a user across the application, data type is string and must be unique and not null.
 * 3. passwordHash: Stores the output of an operation done on password in order to store a reference to it for security purposes, data type is string, must be unique and not null.
 * 4. email: Stores the email of the user, data type is string following the correct regex pattern and must be unique and not null.
 * 5. phone: Stores the users phone number, data type is string of certain length (9), must be unique and not null.
 * 6. Name: Stores the name of the user, data type is string and can be optional.
 * 7. Surname: Stores the surname of the user, data type is string and can be optional.
 * 8. Role: Special field that set a hierarchy class system with permision. Data type is enum and contain three values: admin, barber, user. Must be not null.
 * 9. MissingTrack: Stores a number that tracks if some user has Dates not attended in order to apply payment penalties, data type is number and defaults to 0.
 */ 
const mySQLUser = sequelize.define(
  'User',
  {
    userId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    username: {
      type: DataTypes.STRING(25),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING(72),
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    phone: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(50),
    },
    surname: {
      type: DataTypes.STRING(50),
    },
    role: {
      type: DataTypes.ENUM('admin', 'user', 'barber'),
      allowNull: false,
    },
    missingTrack: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
);

/**
 * Once User is created, the next step is to create the site concept because we will need it for the next concepts, since some of them will include a reference to 
 * the site id. Site fields are:
 * 1. siteId: Primary key stored as number since it will be easier to find. Autoincrement and not null.
 * 2. siteName: Do I need to explain this one. Stored as string, must be unique and not null.
 * 3. siteAddress: And this one. Stored as string, must be unique and not null.
 * 4. siteSchedule: Stored as string. Not null.
 * 5. sitePhone: Stored as string. Not null and unique.
 * 5. siteDescription: Stored as string it provides aditional information about the site in case is required. Can be optional.
 */

const mySQLSite = sequelize.define(
  'Site',
  {
    siteId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    siteName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    siteDirection: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true
    },
    siteSchedule: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    sitePhone: {
      type: DataTypes.STRING(12),
      allowNull: false,
      unique: true
    },
    siteDescription: {
      type: DataTypes.STRING,
    }
  },
);

/**
 * The next concept is barber. It is defined by the following fields:
 * 1. barberId: saved as integer, since it will be easier to find. Primary key.
 * 2. barberName: stored as string, can't be null.
 * 3. barberSurname: stored as string, can't be null.
 * 4. barberPicture: stored as string, it contains the reference to the image path. Can't be null and must be unique.
 * 5. barberDescription: stored as string, it will contain details about the barber to share. It's optional.
 * 5. barberSite: stored as integer, it is the reference to the site of the barber, in other words it is the foreign key.
 * 
 * A barber will be related to a service, but this relation is many to many, so a junction table will be created after service.
 */
const mySQLBarber = sequelize.define(
  'Barber',
  {
    barberId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
    },
    barberName: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    barberSurname: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    barberPicture: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    barberDescription: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    siteIdRef: {
      type: DataTypes.INTEGER,
      references: {
        model: mySQLSite,
        key: 'siteId',
      }
    }, 
  }
);

/**
 * Following concept is Service. The fields are:
 * 1. serviceId: saved as integer, since it will be easier to find. Primary key.
 * 2. serviceType: saved as string, it contains the name of the service, can't be null and must be unique.
 * 3. servicePrice: saved as decimal since it's a currency. Must be not null.
 * 4. serviceDuration: saved as Datetime since it will show time. Must be not null.
 * 5. serviceDescription: saved as string, it displays information about the service itself, must be not null.
 * 
 * Since both barber and site have many to many relationship with service a junction table will be created for this purpose.
 */
const mySQLService = sequelize.define(
  'Service',
  {
    serviceId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    serviceType: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    servicePrice: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    serviceDuration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    serviceDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    siteId: {
      type: DataTypes.INTEGER,
      references: {
        model: mySQLSite,
        key: 'siteId'
      }
    }
  },
);

/**
 * Date will contain all the dates asociated with each site, it will display available dates and will relate to bookings.
 * 1. dateId: primary key stored as integer, since it will be easier to find.
 * 2. dateDate: it will contain a date, stored as date and must be unique and not null.
 * 3. dateAvailability: It will contain if a date is occupied or not. It is stored as an enum for design purposes.
 * 4. siteIdRef: since it's created by a new site entry, it must contain the referece to that site in order to work.
 */
const mySQLDate = sequelize.define(
  'Date',
  {
    dateId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    dateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    dateAvailability: {
      type: DataTypes.ENUM(
        Availability.available.toString(),
        Availability.full.toString()
      ),
      allowNull: false
    },
    dateSiteIdRef: {
      type: DataTypes.INTEGER,
      references: {
        model: mySQLSite,
        key: 'siteId'
      }
    },
  },
);

/**
 * Booking will contain the main objective which is to book an appointment.
 * It contains the following fields:
 * 1. bookingId: primary key, stored as uuid, since it is a sensitive information concept.
 * 2. bookingDate: stored as date, it contains the Date of the booking. Can't be null and must be unique.
 * 3. bookingAnotations: stored as string, it conatins optional or aditional information.
 * 4. bookingTransactionId: contains the id of the payment transaction, stored as string and must be not null.
 * 5. bookingPaymentDate: contains the date of the payment, stored as date must be not null.
 * 6. bookingPrice: contains information about the amount of the payment, stored as decimal, must be not null.
 * 
 * This model will contain a reference to the site, service and date.
 */
const mySQLBooking = sequelize.define(
  'Booking',
  {
    bookingId: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    },
    bookingAnnotations: {
      type: DataTypes.STRING
    },
    bookingTransactionId: {
      type: DataTypes.STRING,
      unique: true,
    },
    bookingPaymentDate: {
      type: DataTypes.DATE,
    },
    bookingPrice: {
      type: DataTypes.DECIMAL(5,2)
    },
    bookingUserId: {
      type: DataTypes.UUID,
      references: {
        model: mySQLUser,
        key: 'userId'
      }
    },
    bookingSiteId: {
      type: DataTypes.INTEGER,
      references: {
        model: mySQLSite,
        key: 'siteId'
      }
    },
    bookingServiceId: {
      type: DataTypes.INTEGER,
      references: {
        model: mySQLService,
        key: 'serviceId'
      }
    },
  },
  {
    timestamps: false
  }
);

/**
 * Junction table to represent the relationship between barbers and services.
 */
mySQLBarber.belongsToMany(mySQLService,
  {
    through: 'BarberService',
    foreignKey: 'barberId',
    otherKey: 'serviceId'
  }
);
mySQLService.belongsToMany(mySQLBarber,
  {
    through: 'BarberService',
    foreignKey: 'serviceId',
    otherKey: 'barberId',
  }
);

/**
 * Junction table to represent the relationship between services and sites.
 */
mySQLService.belongsToMany(mySQLSite,
  {
    through: 'ServiceSite',
    foreignKey: 'serviceId',
    otherKey: 'siteId',
  }
);
mySQLSite.belongsToMany(mySQLService,
  {
    through: 'ServiceSite',
    foreignKey: 'siteId',
    otherKey: 'serviceId',
  }
);

//Init the model. If the mode is DEBUG, it will perform a database reset, so be careful which database you choose.
export const initSQLModels = async () => {
  try {
    if(process.env.NODE_ENV) {
      await sequelize.drop();
    }
    await sequelize.sync();
  } catch (error) {
    console.error('Error initializing models:', error);
  }
};

export { mySQLUser, mySQLSite, mySQLBarber, mySQLService, mySQLDate, mySQLBooking };