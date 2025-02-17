import { z } from "zod";

export const serviceSiteSchema = z.object({
  serviceId: z.number().optional(),
  siteId: z.number().optional(),
}).strict();

export const createServiceSiteSchema = z.object({
  serviceId: z.number(),
  siteId: z.number(),
}).strict();

export type ServiceSiteSchema = z.infer<typeof serviceSiteSchema>;
export type CreateServiceSiteSchema = z.infer<typeof createServiceSiteSchema>;