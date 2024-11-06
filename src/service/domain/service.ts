export interface ServiceFields {
  serviceId: number,
  type: string,
  price: number,
  duration: Date,
  description: string
}

export type ServiceFieldsNoId = Omit<ServiceFields, 'serviceId'>;

export class Service {
  constructor(readonly serviceFields: ServiceFields) { }
}