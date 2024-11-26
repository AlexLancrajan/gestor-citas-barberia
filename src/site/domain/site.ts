/**
 * Site contains the following fields:
 * 1. SiteInputFields: For creation and modification.
 * 2. SiteFields: For querying, modifying and deleting sites.
 */

export interface SiteInputFields {
  siteName: string,
  siteDirection: string,
  siteSchedule: string,
  sitePhone: string,
  siteDescription: string
}

export interface SiteFields extends SiteInputFields{
  siteId: number,
}

