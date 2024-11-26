import { z } from 'zod';

export const serviceSchema = z.object({
  serviceType: z.string(),
  servicePrice: z.number(),
  serviceDuration: z.date(),
  serviceDescription: z.string(),
  siteId: z.number()
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
