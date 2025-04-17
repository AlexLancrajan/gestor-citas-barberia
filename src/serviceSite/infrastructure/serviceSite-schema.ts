import { z } from "zod";

export const serviceSiteSchema = z.object({
  serviceId: z.number({ message: "Service Id format error." }).optional(),
  siteId: z.number({ message: "Site Id format error." }).optional(),
}).strict();

export const createServiceSiteSchema = z.object({
  serviceId: z.number({ message: "Service Id format error." }),
  siteId: z.number({ message: "Site Id format error." }),
}).strict();

export type ServiceSiteSchema = z.infer<typeof serviceSiteSchema>;
export type CreateServiceSiteSchema = z.infer<typeof createServiceSiteSchema>;