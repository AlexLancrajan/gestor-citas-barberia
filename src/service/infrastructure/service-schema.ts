import { z } from 'zod';

export const serviceSchema = z.object({
  serviceType: z.string().trim(),
  servicePrice: z.number(),
  serviceDuration: z.date(),
  serviceDescription: z.string().trim(),
  siteId: z.number()
});

export const serviceModificationSchema = z.object({
  serviceType: z.string().trim().optional(),
  servicePrice: z.number().optional(),
  serviceDuration: z.date().optional(),
  serviceDescription: z.string().trim().optional(),
  siteId: z.number().optional()
});

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type ServiceModificationSchema = z.infer<typeof serviceModificationSchema>;
