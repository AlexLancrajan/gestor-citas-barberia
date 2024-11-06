export interface SiteFields {
  siteId: number,
  name: string,
  direction: string,
  schedule: Date,
  description?: string,
}

export type SiteFieldsNoId = Omit<SiteFields, 'siteId'>;

export class Site {
  constructor(readonly siteFields: SiteFields) { }
}