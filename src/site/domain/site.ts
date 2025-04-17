/**
 * Fields: siteName, siteDirection, siteSchedule, sitePhone, siteDescription.
 */
export interface SiteInputFields {
  siteName: string,
  siteDirection: string,
  siteSchedule: string,
  sitePhone: string,
  siteDescription: string
}

/**It contains all the site fields stored in the database.
 * 
 * Fields: SiteInputFields + siteId.
 */
export interface SiteFields extends SiteInputFields{
  siteId: number,
}

