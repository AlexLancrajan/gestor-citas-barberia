import { z } from 'zod';

export const serviceSchema = z.object({
  serviceType: z.string({ message: "Service Type format error" }).trim()
    .min(1, { message: "Service type must not be empty"}),
  servicePrice: z.number()
    .gte(0, { message: "Price can not be negative."}),
  serviceDuration: z.preprocess((arg) => {
    if (typeof arg === "string") {
      return new Date(arg); // Convert ISO string to Date
    }
    return arg; // Return as is if it's already a Date
  }, z.date({ message: "Date format error."})),
  serviceDescription: z.string().trim()
    .min(1, { message: "Service type must not be empty"}),
  siteId: z.number({ message: "Error on site id format." })
}).strict();

export const serviceModificationSchema = z.object({
  serviceType: z.string({ message: "Service Type format error." }).trim()
    .min(1, { message: "Service type must not be empty"})
    .optional(),
  servicePrice: z.number({ message: "Error on service price format"})
    .gte(0, { message: "Service price must be a positive number. "}),
  serviceDescription: z.string().trim()
    .min(1, { message: "Service type must not be empty"})
    .optional(),
  siteId: z.number({  message: "Error on site id format." }).optional()
}).strict();

export type ServiceSchema = z.infer<typeof serviceSchema>;
export type ServiceModificationSchema = z.infer<typeof serviceModificationSchema>;
