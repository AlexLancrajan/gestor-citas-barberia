import { z } from 'zod';

export const serviceSchema = z.object({
  serviceType: z.string().trim(),
  servicePrice: z.number(),
  serviceDuration: z.preprocess((arg) => {
    if (typeof arg === "string") {
      return new Date(arg); // Convert ISO string to Date
    }
    return arg; // Return as is if it's already a Date
  }, z.date()),
  serviceDescription: z.string().trim(),
  siteId: z.number()
}).strict();

export const serviceModificationSchema = z.object({
  serviceType: z.string().trim().optional(),
  servicePrice: z.number().optional(),
  serviceDuration: z.preprocess((arg) => {
    if (typeof arg === "string") {
      return new Date(arg); // Convert ISO string to Date
    }
    return arg; // Return as is if it's already a Date
  }, z.date()).optional(),
  serviceDescription: z.string().trim().optional(),
  siteId: z.number().optional()
}).strict();

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type ServiceModificationSchema = z.infer<typeof serviceModificationSchema>;
