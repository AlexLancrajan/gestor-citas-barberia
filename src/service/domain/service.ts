/**
 * Service definition. It has three fields depending on input, reference or DB structure.
 * On input it should be used the InputFields.
 * On ref ServiceFields.
 * On retrieving from DB the DBFields.
 */

export interface ServiceInputFields {
  serviceType: string,
  servicePrice: number,
  serviceDuration: Date,
  serviceDescription: string,
  siteId: number,
}

export interface ServiceFields extends ServiceInputFields{
  serviceId: number,
}
